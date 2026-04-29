#!/bin/bash

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
        echo "Selected user: $username"
        echo "Fetching data for $username..."
        grep "$username" history.txt
    #data for selected user
    elif [[ $choice == 2 ]]; then
        echo "Viewing analytics..."
        echo "Top 5 users by score:"
        sort -t  '|' -k2.2 -nr history.txt | head -n 5
        # Placeholder for analytics code
    elif [[ $choice == 3 ]]; then
        echo "Viewing recent scores..."
        sort -t ' ' -k1.2,2.8 -nr history.txt | head -n 5
        # Placeholder for recent scores code
    elif [[ $choice == 4 ]]; then
        echo "Deleting user data..."
        # Placeholder for delete user data code
    elif [[ $choice == 5 ]]; then
        echo "Performing log rotation..."
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
    fi
done