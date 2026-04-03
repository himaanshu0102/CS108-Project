#!/bin/bash
if [ ! -f history.txt ]; then
    echo "No history file found"
elif [ ! -s history.txt ]; then
    echo "History file is empty"
else
    while true; do
#choices


    echo "Snake Admin Menu"
    echo "1. Select User Name"
    echo "2. View Analytics"
    echo "3. View Recent Scores"
    echo "4. Delete User Data"
    echo "5. Log Rotation"
    echo "6. Sort data"
    echo "7. Exit"
    echo "Enter your choice: "
    read choice


    #execution  according to choice


    if [[ $choice == 1 ]]; then
        echo "Enter user name: "
        read username
        if ! grep -q "$username" history.txt ; then
            echo "No records found for username: $username"
            continue
        fi
        while true; do
            echo "Selected choice according to your query for : $username"
            echo "1. View recent scores for $username"
            echo "2. View analytics for $username"
            echo "3. Delete data for $username"
            echo "4. Sort data for $username"
            echo "5. Back to main menu"
            echo "Enter your choice: "
            read user_choice

            grep "$username" history.txt> user_history.txt


            if [[ $user_choice == 1 ]]; then
                count=$(cat user_history.txt |wc -l)
                if [[ $count -eq 0 ]]; then
                    echo "No scores available."
                else
                    echo "Recent scores:"
                    line=1
                    while [[ $line -lt $count ]]; do
                        sort -t ' ' -k1.2,2.8 -nr user_history.txt | sed -n "$line,$((line+4))p"
                        line=$((line+5))
                        if [[ $line -lt $count ]]; then
                            echo "Type 'y' to see more scores or any other key to stop: "
                            read more_choice
                            if [[ $more_choice != "y" ]]; then
                                break
                            fi
                        else
                            echo "No more scores to display."
                            break
                        fi
                   
                    done
                fi
            elif [[ $user_choice == 2 ]]; then
                echo "Enter analytics choice for $username (1: Average score, 2: Average time survived, 3: Fraction of deaths by wall collision, 4: Fraction of deaths by self collision): "
                read user_analytics_choice
                if [[ "$(tail -c1 user_history.txt)" ]]; then
                    echo >> user_history.txt
                fi
                if [[ $user_analytics_choice == 1 ]]; then
                    sum=$(cut -d '|' -f2 user_history.txt | paste -sd '+'| bc)
                    count=$(cat user_history.txt |wc -l)
                    echo "Average score for $username:"
                    echo "scale=2; $sum/$count" |bc

                elif [[ $user_analytics_choice == 2 ]]; then
                    sum=$(cut -d '|' -f4 user_history.txt | paste -sd '+'| bc)
                    count=$(cat user_history.txt |wc -l)
                    echo "Average Time survived for $username:"
                    echo "scale=2; $sum/$count" |bc

                elif [[ $user_analytics_choice == 3 ]]; then
                    number_of_wall_death=$(grep "WALL" user_history.txt | wc -l)
                    count=$(cat user_history.txt |wc -l)
                    echo "Fraction of deaths by wall collision for $username:"
                    echo "scale=2; $number_of_wall_death/$count" |bc

                elif [[ $user_analytics_choice == 4 ]]; then
                    number_of_self_death=$(grep "SELF" user_history.txt | wc -l)
                    count=$(cat user_history.txt |wc -l)
                    echo "Fraction of deaths by self collision for $username:"
                    echo "scale=2; $number_of_self_death/$count" |bc

                else
                    echo "Invalid analytics choice for $username."
                fi
            
            elif [[ $user_choice == 3 ]]; then
                echo "Enter your choice for deletion for $username (1: delete by timestamp, 2: delete all invalid records): "
                read user_delete_choice
                if [[ $user_delete_choice == 1 ]]; then
                    echo "Enter timestamp to delete for $username (format: YYYY-MM-DD HH:MM:SS): "
                    read user_del_timestamp
                    if ! grep -q "$user_del_timestamp" user_history.txt ; then
                        echo "No records found for the given timestamp: $user_del_timestamp for $username"
                        continue
                    fi
                    echo "You want to delete records for (1. exact timestamp, 2. all records before this timestamp, 3. all records after this timestamp) for $username: "
                    read user_timestamp_delete_option
                    sort -t ' ' -k1.2,2.8 -nr user_history.txt > sorted_user_history.txt
                    line_numbers=$(grep -n "$user_del_timestamp" sorted_user_history.txt | cut -d ':' -f1)
                    total_lines=$(grep -v "^$" sorted_user_history.txt | wc -l)
                    if [[ $user_timestamp_delete_option == 1 ]]; then
                        grep "$user_del_timestamp" sorted_user_history.txt
                        echo "Are you sure you want to delete records for exact timestamp: $user_del_timestamp for $username? (y/n): "
                        read confirm_delete
                        if [[ $confirm_delete == "y" ]]; then
                            grep -v "$user_del_timestamp" sorted_user_history.txt > temp.txt && mv temp.txt user_history.txt
                            grep -v "$user_del_timestamp" history.txt > temp.txt && mv temp.txt history.txt
                            echo "Deleted records for exact timestamp: $user_del_timestamp for $username"
                        fi
                    elif [[ $user_timestamp_delete_option == 2 ]]; then
                        tail -n $((total_lines - line_numbers)) sorted_user_history.txt
                        echo "Are you sure you want to delete all records before timestamp: $user_del_timestamp for $username? (y/n): "
                        read confirm_delete
                        if [[ $confirm_delete == "y" ]]; then
                            head -n $line_numbers  sorted_user_history.txt > temp.txt && mv temp.txt user_history.txt
                            head -n $line_numbers  sorted_user_history.txt > temp.txt && mv temp.txt history.txt
                            echo "Deleted records before timestamp: $user_del_timestamp for $username"
                        fi
                    elif [[ $user_timestamp_delete_option == 3 ]]; then
                        head -n $((line_numbers - 1)) sorted_user_history.txt   
                        echo "Are you sure you want to delete all records after timestamp: $user_del_timestamp for $username? (y/n): "
                        read confirm_delete
                        if [[ $confirm_delete == "y" ]]; then
                            tail -n $((total_lines - line_numbers + 1)) sorted_user_history.txt > temp.txt && mv temp.txt user_history.txt
                            tail -n $((total_lines - line_numbers + 1)) sorted_user_history.txt > temp.txt && mv temp.txt history.txt
                            echo "Deleted records after timestamp: $user_del_timestamp for $username"
                        fi
                    else
                        echo "Invalid timestamp deletion option for $username."
                    fi
                elif [[ $user_delete_choice == 2 ]]; then
                    grep -vE "\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] $username \| [0-9]+ \| WALL \| [0-9]+|\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] $username \| [0-9]+ \| SELF \| [0-9]+" user_history.txt
                    echo "Are you sure you want to delete all invalid records for $username? (y/n): "
                    read confirm_delete
                    if [[ $confirm_delete == "y" ]]; then
                        grep -E "\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] $username \| [0-9]+ \| WALL \| [0-9]+|\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] $username \| [0-9]+ \| SELF \| [0-9]+" user_history.txt> temp.txt && mv temp.txt user_history.txt
                        grep -E "\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] $username \| [0-9]+ \| WALL \| [0-9]+|\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] $username \| [0-9]+ \| SELF \| [0-9]+" history.txt> temp.txt && mv temp.txt history.txt
                        echo "Deleted all invalid records for $username."
                    fi
                else
                    echo "Invalid deletion choice for $username."
                fi
                rm -f sorted_user_history.txt temp.txt
             elif [[ $user_choice == 4 ]]; then
                echo "Enter your choice for sorting for $username (1: by score, 2: by timestamp): "
                read user_sort_choice
                if [[ $user_sort_choice == 1 ]]; then
                    echo "Sorting by score for $username..."
                    sort -t '|' -k2.2 -nr user_history.txt

                elif [[ $user_sort_choice == 2 ]]; then
                    echo "Sorting by timestamp for $username..."
                    sort -t ' ' -k1.2,2.8 -nr user_history.txt

                else
                    echo "Invalid sorting choice for $username."
                fi
            else
                echo "Returning to main menu..."
                rm -f user_history.txt
                break
            fi
        done

    #data for selected user


    elif [[ $choice == 2 ]]; then
        echo "Enter analytics option (1: Top 5 users, 2: Average score, 3: Average time survived, 4: Fraction of deaths by wall collision, 5: Fraction of deaths by self collision): "
        read analytics_option
        if [[ "$(tail -c1 history.txt)" ]]; then
            echo >> history.txt
        fi

        if [[ $analytics_option == 1 ]]; then
            echo "Top 5 users by score:"
            sort -t  '|' -k2.2 -nr history.txt | head -n 5


        elif [[ $analytics_option == 2 ]]; then
            sum=$(cut -d '|' -f2 history.txt | paste -sd '+'| bc)
            count=$(cat history.txt |wc -l)
            echo "Average score:"
            echo "scale=2; $sum/$count" |bc


        elif [[ $analytics_option == 3 ]]; then
            sum=$(cut -d '|' -f4 history.txt | paste -sd '+'| bc)
            count=$(cat history.txt |wc -l)
            echo "Average Time survived:"
            echo "scale=2; $sum/$count" |bc


        elif [[ $analytics_option == 4 ]]; then
            number_of_wall_death=$(grep "WALL" history.txt | wc -l)
            count=$(cat history.txt |wc -l)
            echo "Fraction of deaths by wall collision:"
            echo "scale=2; $number_of_wall_death/$count" |bc


        elif [[ $analytics_option == 5 ]]; then
            number_of_self_death=$(grep "SELF" history.txt | wc -l)
            count=$(cat history.txt |wc -l)
            echo "Fraction of deaths by self collision:"
            echo "scale=2; $number_of_self_death/$count" |bc

        else
            echo "Invalid analytics option."
        fi
        # Placeholder for analytics code


    elif [[ $choice == 3 ]]; then
        count=$(cat history.txt |wc -l)
        if [[ $count -eq 0 ]]; then
            echo "No scores available."
        else
            echo "Recent scores:"
            line=1
                while [[ $line -lt $count ]]; do
                    sort -t ' ' -k1.2,2.8 -nr history.txt | sed -n "$line,$((line+4))p"
                    line=$((line+5))
                    if [[ $line -lt $count ]]; then
                        echo "Type 'y' to see more scores or any other key to stop: "
                        read more_choice
                        if [[ $more_choice != "y" ]]; then
                            break
                        fi
                    else
                        echo "No more scores to display."
                        break
                    fi
                   
                done
        fi
        # Placeholder for recent scores code


    elif [[ $choice == 4 ]]; then
        echo "Enter your choice for deletion (1: delete by username, 2: delete by timestamp, 3: delete all invalid records): "
        read delete_choice
        if [[ $delete_choice == 1 ]]; then
            echo "Enter username to delete: "
            read del_username
            if  ! grep -q "$del_username" history.txt ; then
                echo "No records found for username: $del_username"
                continue
            fi
            grep  "$del_username" history.txt
            echo "Are you sure you want to delete all records for username: $del_username? (y/n): "
            read confirm_delete
            if [[ $confirm_delete == "y" ]]; then
                grep -v "$del_username" history.txt > temp.txt && mv temp.txt history.txt
                echo "Deleted records for username: $del_username"
            fi

        elif [[ $delete_choice == 2 ]]; then
            echo "Enter timestamp to delete (format: YYYY-MM-DD HH:MM:SS): "
            read del_timestamp
            if ! grep -q "$del_timestamp" history.txt ; then
                echo "No records found for the given timestamp: $del_timestamp"
                continue
            fi
            echo "You want to delete records for (1. exact timestamp, 2. all records before this timestamp, 3. all records after this timestamp): "
            read timestamp_delete_option
            sort -t ' ' -k1.2,2.8 -nr history.txt > sorted_history.txt
            line_numbers=$(grep -n "$del_timestamp" sorted_history.txt | cut -d ':' -f1)
            total_lines=$(grep -v "^$" sorted_history.txt | wc -l)
            if [[ $timestamp_delete_option == 1 ]]; then
                grep "$del_timestamp" sorted_history.txt
                echo "Are you sure you want to delete records for exact timestamp: $del_timestamp? (y/n): "
                read confirm_delete
                if [[ $confirm_delete == "y" ]]; then
                    grep -v "$del_timestamp" sorted_history.txt > temp.txt && mv temp.txt history.txt
                    echo "Deleted records for exact timestamp: $del_timestamp"
                fi
            elif [[ $timestamp_delete_option == 2 ]]; then
                tail -n $((total_lines - line_numbers)) sorted_history.txt
                echo "Are you sure you want to delete all records before timestamp: $del_timestamp? (y/n): "
                read confirm_delete
                if [[ $confirm_delete == "y" ]]; then
                    head -n $line_numbers  sorted_history.txt > temp.txt && mv temp.txt history.txt
                    echo "Deleted records before timestamp: $del_timestamp"
                fi
            elif [[ $timestamp_delete_option == 3 ]]; then
                head -n $((line_numbers - 1)) sorted_history.txt
                echo "Are you sure you want to delete all records after timestamp: $del_timestamp? (y/n): "
                read confirm_delete
                if [[ $confirm_delete == "y" ]]; then
                    tail -n $((total_lines - line_numbers + 1)) sorted_history.txt > temp.txt && mv temp.txt history.txt
                    echo "Deleted records after timestamp: $del_timestamp"
                fi
            else
                echo "Invalid timestamp deletion option."
            fi

        elif [[ $delete_choice == 3 ]]; then
            grep -vE "\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] [a-zA-Z]+ \| [0-9]+ \| WALL \| [0-9]+|\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] [a-zA-Z]+ \| [0-9]+ \| SELF \| [0-9]+" history.txt
            echo "Are you sure you want to delete all invalid records? (y/n): "
            read confirm_delete
            if [[ $confirm_delete == "y" ]]; then
                grep -E "\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] [a-zA-Z]+ \| [0-9]+ \| WALL \| [0-9]+|\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] [a-zA-Z]+ \| [0-9]+ \| SELF \| [0-9]+" history.txt> temp.txt && mv temp.txt history.txt
                echo "Deleted all invalid records."
            fi

        else
            echo "Invalid deletion choice."
        fi
        rm -f sorted_history.txt temp.txt
        # Placeholder for delete user data code
    elif [[ $choice == 5 ]]; then
        echo "Performing log rotation..."
        sort -t ' ' -k1.2,2.8 -nr history.txt > sorted_history.txt
        zip backup_$(date +%Y%m%d_%H%M%S).zip sorted_history.txt
        head -n 10 sorted_history.txt > temp.txt && mv temp.txt history.txt
        rm -f sorted_history.txt
        # Placeholder for log rotation code


    elif [[ $choice == 6 ]]; then
        echo "Enter your choice for sorting (1: by score, 2: by timestamp, 3: by username): "
        read sort_choice
        
        if [[ $sort_choice == 1 ]]; then
            echo "Sorting by score..."
            sort -t '|' -k2.2 -nr history.txt

        elif [[ $sort_choice == 2 ]]; then
            echo "Sorting by timestamp..."
            sort -t ' ' -k1.2,2.8 -nr history.txt

        elif [[ $sort_choice == 3 ]]; then
            echo "Sorting by username..."
            sort -t ' ' -k3,3 history.txt

        else
            echo "Invalid sorting choice."
        fi
        # Placeholder for sorting data code


    elif [[ $choice == 7 ]]; then
        echo "Exiting..."
        break
    else
        echo "Invalid choice. Please try again."
    fi
done
fi
