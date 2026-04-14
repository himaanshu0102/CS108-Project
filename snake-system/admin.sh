#!/bin/bash
if [ ! -f history.txt ]; then
    echo -e "${BOLD}${RED}No history file found${RESET}"
elif [ ! -s history.txt ]; then
    echo -e "${BOLD}${RED}History file is empty${RESET}"
else
    while true; do

#color codes
RED='\033[31m'
BLUE='\033[34m'
GREEN='\033[32m'
YELLOW='\033[33m'
CYAN='\033[36m'
BOLD='\033[1m'
RESET='\033[0m'

print_colored() {
    while read line; do
        if echo "$line" | grep -q "WALL"; then
            echo -e "${BLUE}$line${RESET}"
        elif echo "$line" | grep -q "SELF"; then
            echo -e "${RED}$line${RESET}"
        else
            echo "$line"
        fi
    done
}
#choices


    echo -e "${BOLD}${YELLOW}Snake Admin Menu${RESET}"
    echo -e "${YELLOW}1. Select User Name${RESET}"
    echo -e "${YELLOW}2. View Analytics${RESET}"
    echo -e "${YELLOW}3. View Recent Scores${RESET}"
    echo -e "${YELLOW}4. Delete User Data${RESET}"
    echo -e "${YELLOW}5. Log Rotation${RESET}"
    echo -e "${YELLOW}6. Sort data${RESET}"
    echo -e "${YELLOW}7. Exit${RESET}"
    echo -e "${BOLD}${CYAN}Enter your choice: ${RESET}"
    read choice


    #execution  according to choice


    if [[ $choice == 1 ]]; then
        echo -e "${BOLD}${CYAN}Enter user name: ${RESET}"
        read username
        if ! grep -q "$username" history.txt ; then
            echo -e "${RED}No records found for username: $username${RESET}"
            continue
        fi
        while true; do
            echo -e "${BOLD}${YELLOW}Selected choice according to your query for : $username${RESET}"
            echo -e "${YELLOW}1. View recent scores for $username${RESET}"
            echo -e "${YELLOW}2. View analytics for $username${RESET}"
            echo -e "${YELLOW}3. Delete data for $username${RESET}"
            echo -e "${YELLOW}4. Sort data for $username${RESET}"
            echo -e "${YELLOW}5. Back to main menu${RESET}"
            echo -e "${BOLD}${CYAN}Enter your choice: ${RESET}"
            read user_choice

            grep "$username" history.txt> user_history.txt


            if [[ $user_choice == 1 ]]; then
                count=$(cat user_history.txt |wc -l)
                if [[ $count -eq 0 ]]; then
                    echo -e "${RED}No scores available.${RESET}"
                else
                    echo -e "${GREEN}Recent scores:${RESET}"
                    line=1
                    while [[ $line -lt $count ]]; do
                        sort -t ' ' -k1.2,2.8 -nr user_history.txt | sed -n "$line,$((line+4))p"| print_colored
                        line=$((line+5))
                        if [[ $line -lt $count ]]; then
                            echo -e "${BOLD}${CYAN}Type 'y' to see more scores or any other key to stop: ${RESET}"
                            read more_choice
                            if [[ $more_choice != "y" ]]; then
                                break
                            fi
                        else
                            echo -e "${RED}No more scores to display.${RESET}"
                            break
                        fi
                   
                    done
                fi
            elif [[ $user_choice == 2 ]]; then
                echo -e "${BOLD}${CYAN}Enter analytics choice for $username (1: Average score, 2: Average time survived, 3: Fraction of deaths by wall collision, 4: Fraction of deaths by self collision): ${RESET}"
                read user_analytics_choice
                if [[ "$(tail -c1 user_history.txt)" ]]; then
                    echo >> user_history.txt
                fi
                if [[ $user_analytics_choice == 1 ]]; then
                    sum=$(cut -d '|' -f2 user_history.txt | paste -sd '+'| bc)
                    count=$(cat user_history.txt |wc -l)
                    echo -e "${GREEN}Average score for $username:${RESET}"
                    echo "scale=2; $sum/$count" |bc

                elif [[ $user_analytics_choice == 2 ]]; then
                    sum=$(cut -d '|' -f4 user_history.txt | paste -sd '+'| bc)
                    count=$(cat user_history.txt |wc -l)
                    echo -e "${GREEN}Average Time survived for $username:${RESET}"
                    echo "scale=2; $sum/$count" |bc

                elif [[ $user_analytics_choice == 3 ]]; then
                    number_of_wall_death=$(grep "WALL" user_history.txt | wc -l)
                    count=$(cat user_history.txt |wc -l)
                    echo -e "${GREEN}Fraction of deaths by wall collision for $username:${RESET}"
                    echo "scale=2; $number_of_wall_death/$count" |bc

                elif [[ $user_analytics_choice == 4 ]]; then
                    number_of_self_death=$(grep "SELF" user_history.txt | wc -l)
                    count=$(cat user_history.txt |wc -l)
                    echo -e "${GREEN}Fraction of deaths by self collision for $username:${RESET}"
                    echo "scale=2; $number_of_self_death/$count" |bc

                else
                    echo -e "${RED}Invalid analytics choice for $username.${RESET}"
                fi
            
            elif [[ $user_choice == 3 ]]; then
                echo -e "${BOLD}${CYAN}Enter your choice for deletion for $username (1: delete by timestamp, 2: delete all invalid records): ${RESET}"
                read user_delete_choice
                if [[ $user_delete_choice == 1 ]]; then
                    echo -e "${BOLD}${CYAN}Enter timestamp to delete for $username (format: YYYY-MM-DD HH:MM:SS): ${RESET}"
                    read user_del_timestamp
                    if ! grep -q "$user_del_timestamp" user_history.txt ; then
                        echo -e "${RED}No records found for the given timestamp: $user_del_timestamp for $username${RESET}"
                        continue
                    fi
                    echo -e "${BOLD}${CYAN}You want to delete records for (1. exact timestamp, 2. all records before this timestamp, 3. all records after this timestamp) for $username: ${RESET}"
                    read user_timestamp_delete_option
                    sort -t ' ' -k1.2,2.8 -nr user_history.txt > sorted_user_history.txt
                    line_numbers=$(grep -n "$user_del_timestamp" sorted_user_history.txt | cut -d ':' -f1)
                    total_lines=$(grep -v "^$" sorted_user_history.txt | wc -l)
                    if [[ $user_timestamp_delete_option == 1 ]]; then
                        grep "$user_del_timestamp" sorted_user_history.txt| print_colored
                        echo -e "${BOLD}${CYAN}Are you sure you want to delete records for exact timestamp: $user_del_timestamp for $username? (y/n): ${RESET}"
                        read confirm_delete
                        if [[ $confirm_delete == "y" ]]; then
                            grep -v "$user_del_timestamp" sorted_user_history.txt > temp.txt && mv temp.txt user_history.txt
                            grep -v "$user_del_timestamp" history.txt > temp.txt && mv temp.txt history.txt
                            echo -e "${GREEN}Deleted records for exact timestamp: $user_del_timestamp for $username${RESET}"
                        fi
                    elif [[ $user_timestamp_delete_option == 2 ]]; then
                        tail -n $((total_lines - line_numbers)) sorted_user_history.txt| print_colored
                        echo -e "${BOLD}${CYAN}Are you sure you want to delete all records before timestamp: $user_del_timestamp for $username? (y/n): ${RESET}"
                        read confirm_delete
                        if [[ $confirm_delete == "y" ]]; then
                            head -n $line_numbers  sorted_user_history.txt > temp.txt && mv temp.txt user_history.txt
                            head -n $line_numbers  sorted_user_history.txt > temp.txt && mv temp.txt history.txt
                            echo -e "${GREEN}Deleted records before timestamp: $user_del_timestamp for $username${RESET}"
                        fi
                    elif [[ $user_timestamp_delete_option == 3 ]]; then
                        head -n $((line_numbers - 1)) sorted_user_history.txt| print_colored
                        echo -e "${BOLD}${CYAN}Are you sure you want to delete all records after timestamp: $user_del_timestamp for $username? (y/n): ${RESET}"
                        read confirm_delete
                        if [[ $confirm_delete == "y" ]]; then
                            tail -n $((total_lines - line_numbers + 1)) sorted_user_history.txt > temp.txt && mv temp.txt user_history.txt
                            tail -n $((total_lines - line_numbers + 1)) sorted_user_history.txt > temp.txt && mv temp.txt history.txt
                            echo -e "${GREEN}Deleted records after timestamp: $user_del_timestamp for $username${RESET}"
                        fi
                    else
                        echo -e "${RED}Invalid timestamp deletion option for $username.${RESET}"
                    fi
                elif [[ $user_delete_choice == 2 ]]; then
                    grep -vE "\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] $username \| [0-9]+ \| WALL \| [0-9]+|\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] $username \| [0-9]+ \| SELF \| [0-9]+" user_history.txt| print_colored
                    echo -e "${BOLD}${CYAN}Are you sure you want to delete all invalid records for $username? (y/n): ${RESET}"
                    read confirm_delete
                    if [[ $confirm_delete == "y" ]]; then
                        grep -E "\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] $username \| [0-9]+ \| WALL \| [0-9]+|\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] $username \| [0-9]+ \| SELF \| [0-9]+" user_history.txt> temp.txt && mv temp.txt user_history.txt
                        grep -E "\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] $username \| [0-9]+ \| WALL \| [0-9]+|\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] $username \| [0-9]+ \| SELF \| [0-9]+" history.txt> temp.txt && mv temp.txt history.txt
                        echo -e "${GREEN}Deleted all invalid records for $username.${RESET}"
                    fi
                else
                    echo -e "${RED}Invalid deletion choice for $username.${RESET}"
                fi
                rm -f sorted_user_history.txt temp.txt
             elif [[ $user_choice == 4 ]]; then
                echo -e "${BOLD}${CYAN}Enter your choice for sorting for $username (1: by score, 2: by timestamp): ${RESET}"
                read user_sort_choice
                if [[ $user_sort_choice == 1 ]]; then
                    echo -e "${GREEN}Sorting by score for $username...${RESET}"
                    sort -t '|' -k2.2 -nr user_history.txt| print_colored

                elif [[ $user_sort_choice == 2 ]]; then
                    echo -e "${GREEN}Sorting by timestamp for $username...${RESET}"
                    sort -t ' ' -k1.2,2.8 -nr user_history.txt| print_colored   

                else
                    echo -e "${RED}Invalid sorting choice for $username.${RESET}"
                fi
            else
                echo -e "${GREEN}Returning to main menu...${RESET}"
                rm -f user_history.txt
                break
            fi
        done

    #data for selected user


    elif [[ $choice == 2 ]]; then
        echo -e "${BOLD}${CYAN}Enter analytics option (1: Top 5 users, 2: Average score, 3: Average time survived, 4: Fraction of deaths by wall collision, 5: Fraction of deaths by self collision): ${RESET}"
        read analytics_option
        if [[ "$(tail -c1 history.txt)" ]]; then
            echo >> history.txt
        fi

        if [[ $analytics_option == 1 ]]; then
            echo -e "${GREEN}Top 5 users by score:${RESET}"
            sort -t  '|' -k2.2 -nr history.txt | head -n 5| print_colored


        elif [[ $analytics_option == 2 ]]; then
            sum=$(cut -d '|' -f2 history.txt | paste -sd '+'| bc)
            count=$(cat history.txt |wc -l)
            echo -e "${GREEN}Average score:${RESET}"
            echo "scale=2; $sum/$count" |bc


        elif [[ $analytics_option == 3 ]]; then
            sum=$(cut -d '|' -f4 history.txt | paste -sd '+'| bc)
            count=$(cat history.txt |wc -l)
            echo -e "${GREEN}Average Time survived:${RESET}"
            echo "scale=2; $sum/$count" |bc


        elif [[ $analytics_option == 4 ]]; then
            number_of_wall_death=$(grep "WALL" history.txt | wc -l)
            count=$(cat history.txt |wc -l)
            echo -e "${GREEN}Fraction of deaths by wall collision:${RESET}"
            echo "scale=2; $number_of_wall_death/$count" |bc


        elif [[ $analytics_option == 5 ]]; then
            number_of_self_death=$(grep "SELF" history.txt | wc -l)
            count=$(cat history.txt |wc -l)
            echo -e "${GREEN}Fraction of deaths by self collision:${RESET}"
            echo "scale=2; $number_of_self_death/$count" |bc

        else
            echo -e "${RED}Invalid analytics option.${RESET}"
        fi
        # Placeholder for analytics code


    elif [[ $choice == 3 ]]; then
        count=$(cat history.txt |wc -l)
        if [[ $count -eq 0 ]]; then
            echo -e "${RED}No scores available.${RESET}"
        else
            echo -e "${GREEN}Recent scores:${RESET}"
            line=1
                while [[ $line -lt $count ]]; do
                    sort -t ' ' -k1.2,2.8 -nr history.txt | sed -n "$line,$((line+4))p"| print_colored
                    line=$((line+5))
                    if [[ $line -lt $count ]]; then
                        echo -e "${BOLD}${CYAN}Type 'y' to see more scores or any other key to stop: ${RESET}"
                        read more_choice
                        if [[ $more_choice != "y" ]]; then
                            break
                        fi
                    else
                        echo -e "${RED}No more scores to display.${RESET}"
                        break
                    fi
                   
                done
        fi
        # Placeholder for recent scores code


    elif [[ $choice == 4 ]]; then
        echo -e "${BOLD}${CYAN}Enter your choice for deletion (1: delete by username, 2: delete by timestamp, 3: delete all invalid records): ${RESET}"
        read delete_choice
        if [[ $delete_choice == 1 ]]; then
            echo -e "${BOLD}${CYAN}Enter username to delete: ${RESET}"
            read del_username
            if  ! grep -q "$del_username" history.txt ; then
                echo -e "${RED}No records found for username: $del_username${RESET}"
                continue
            fi
            grep  "$del_username" history.txt| print_colored
            echo -e "${BOLD}${CYAN}Are you sure you want to delete all records for username: $del_username? (y/n): ${RESET}"
            read confirm_delete
            if [[ $confirm_delete == "y" ]]; then
                grep -v "$del_username" history.txt > temp.txt && mv temp.txt history.txt
                echo -e "${GREEN}Deleted records for username: $del_username${RESET}"
            fi

        elif [[ $delete_choice == 2 ]]; then
            echo -e "${BOLD}${CYAN}Enter timestamp to delete (format: YYYY-MM-DD HH:MM:SS): ${RESET}"
            read del_timestamp
            if ! grep -q "$del_timestamp" history.txt ; then
                echo -e "${RED}No records found for the given timestamp: $del_timestamp${RESET}"
                continue
            fi
            echo -e "${BOLD}${CYAN}You want to delete records for (1. exact timestamp, 2. all records before this timestamp, 3. all records after this timestamp): ${RESET}"
            read timestamp_delete_option
            sort -t ' ' -k1.2,2.8 -nr history.txt > sorted_history.txt
            line_numbers=$(grep -n "$del_timestamp" sorted_history.txt | cut -d ':' -f1)
            total_lines=$(grep -v "^$" sorted_history.txt | wc -l)
            if [[ $timestamp_delete_option == 1 ]]; then
                grep "$del_timestamp" sorted_history.txt| print_colored
                echo -e "${BOLD}${CYAN}Are you sure you want to delete records for exact timestamp: $del_timestamp? (y/n): ${RESET}"
                read confirm_delete
                if [[ $confirm_delete == "y" ]]; then
                    grep -v "$del_timestamp" sorted_history.txt > temp.txt && mv temp.txt history.txt
                    echo -e "${GREEN}Deleted records for exact timestamp: $del_timestamp${RESET}"
                fi
            elif [[ $timestamp_delete_option == 2 ]]; then
                tail -n $((total_lines - line_numbers)) sorted_history.txt| print_colored
                echo -e "${BOLD}${CYAN}Are you sure you want to delete all records before timestamp: $del_timestamp? (y/n): ${RESET}"
                read confirm_delete
                if [[ $confirm_delete == "y" ]]; then
                    head -n $line_numbers  sorted_history.txt > temp.txt && mv temp.txt history.txt
                    echo -e "${GREEN}Deleted records before timestamp: $del_timestamp${RESET}"
                fi
            elif [[ $timestamp_delete_option == 3 ]]; then
                head -n $((line_numbers - 1)) sorted_history.txt| print_colored
                echo -e "${BOLD}${CYAN}Are you sure you want to delete all records after timestamp: $del_timestamp? (y/n): ${RESET}"
                read confirm_delete
                if [[ $confirm_delete == "y" ]]; then
                    tail -n $((total_lines - line_numbers + 1)) sorted_history.txt > temp.txt && mv temp.txt history.txt
                    echo -e "${GREEN}Deleted records after timestamp: $del_timestamp${RESET}"
                fi
            else
                echo -e "${RED}Invalid timestamp deletion option.${RESET}"
            fi

        elif [[ $delete_choice == 3 ]]; then
            grep -vE "\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] [a-zA-Z]+ \| [0-9]+ \| WALL \| [0-9]+|\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] [a-zA-Z]+ \| [0-9]+ \| SELF \| [0-9]+" history.txt| print_colored
            echo -e "${BOLD}${CYAN}Are you sure you want to delete all invalid records? (y/n): ${RESET}"
            read confirm_delete
            if [[ $confirm_delete == "y" ]]; then
                grep -E "\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] [a-zA-Z]+ \| [0-9]+ \| WALL \| [0-9]+|\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] [a-zA-Z]+ \| [0-9]+ \| SELF \| [0-9]+" history.txt> temp.txt && mv temp.txt history.txt
                echo -e "${GREEN}Deleted all invalid records.${RESET}"
            fi

        else
            echo -e "${RED}Invalid deletion choice.${RESET}"
        fi
        rm -f sorted_history.txt temp.txt
        # Placeholder for delete user data code
    elif [[ $choice == 5 ]]; then
        echo -e "${GREEN}Performing log rotation...${RESET}"
        sort -t ' ' -k1.2,2.8 -nr history.txt > sorted_history.txt
        zip backup_$(date +%Y%m%d_%H%M%S).zip sorted_history.txt
        head -n 10 sorted_history.txt > temp.txt && mv temp.txt history.txt
        rm -f sorted_history.txt
        # Placeholder for log rotation code


    elif [[ $choice == 6 ]]; then
        echo -e "${BOLD}${CYAN}Enter your choice for sorting (1: by score, 2: by timestamp, 3: by username): ${RESET}"
        read sort_choice
        
        if [[ $sort_choice == 1 ]]; then
            echo -e "${GREEN}Sorting by score...${RESET}"
            sort -t '|' -k2.2 -nr history.txt| print_colored

        elif [[ $sort_choice == 2 ]]; then
            echo -e "${GREEN}Sorting by timestamp...${RESET}"
            sort -t ' ' -k1.2,2.8 -nr history.txt| print_colored

        elif [[ $sort_choice == 3 ]]; then
            echo -e "${GREEN}Sorting by username...${RESET}"
            sort -t ' ' -k3,3 history.txt| print_colored

        else
            echo -e "${RED}Invalid sorting choice.${RESET}"
        fi
        # Placeholder for sorting data code


    elif [[ $choice == 7 ]]; then
        echo -e "${GREEN}Exiting...${RESET}"
        break
    else
        echo -e "${RED}Invalid choice. Please try again.${RESET}"
    fi
done
fi
