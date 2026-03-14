let pos_month = 0;
let active_date = '';


const calendar = document.getElementById('calendar');
const month_year_display = document.getElementById('month_year_display');
const task_input = document.getElementById('task_input');
const task_zone = document.getElementById('task_zone');
const pop_up = document.getElementById('pop_up');

const date_options1 = {
    year: "numeric",
    month: "long",
}

const data = {
    tasks: [],
}


function generate_calender() {
    calendar.innerHTML = '';
    const time_n_date = new Date();

    // sets the month depending on the current month and pos_month. pos_month 2 means 2 months ahead;
    if (pos_month != 0) {
        time_n_date.setMonth(new Date().getMonth() + pos_month);
    } 

    const day = time_n_date.getDate();
    const month = time_n_date.getMonth();
    const year = time_n_date.getFullYear();


    //Each month starts at day 1. using 0 for day goes back one the previous day
    const num_days_month = new Date(year, month + 1, 0).getDate();

    const first_weekday = new Date(year, month, 1).getDay();

    // Determines how many invisible div blocks are needed at the start of the calendar
    // to ensure the first day block starts at the correct day of the week
    let extra_days;
    if (first_weekday == 0) {
        extra_days = 6;
    } else {
        extra_days = first_weekday - 1;
    }

    // a string of month and year that is at the top left
    month_year_display.innerText = time_n_date.toLocaleDateString("en-AU", date_options1);
    
    for (let i = 1; i <= num_days_month + extra_days; i++) {
        const new_day = document.createElement('div');

        // creates the boxes for each day of the month in the calendar
        if (i > extra_days) {
            new_day.classList.add('box_day');
            new_day.innerText = i - extra_days;

            let date_string = `${i - extra_days}/${month + 1}/${year}`;

            // opens up the pop up where you can see, add and delete tasks
            new_day.addEventListener('click', () => show_pop_up(date_string));
            // accesses data structure and finds tasks that are linked to a boxes date
            const tasks_for_day = data.tasks.filter((my_task) => my_task.date === date_string);

            // zone in a day block, slightly below the day number, where tasks are listed
            const task_box_display_zone = document.createElement('div');
            task_box_display_zone.classList.add('task_box_zone');
            new_day.append(task_box_display_zone);

            // creates divs for tasks to be displayed in a day block on the calendar
            for (const daily_tasks of tasks_for_day) {
                const task_box_display = document.createElement('div');
                task_box_display.classList.add('task_box');
                task_box_display.innerText = daily_tasks.task_string;
                task_box_display_zone.append(task_box_display);
            }
        }

        // colours in the box that corresponds to todays date
        if (i - extra_days == day && pos_month == 0) {
            new_day.id = 'today';
        }

        calendar.appendChild(new_day);

    }


}


function buttons () {
    const next_bttn = document.getElementById('next_button');
    const prev_bttn = document.getElementById('prev_button');

    const add_bttn = document.getElementById('add_button');
    const close_bttn = document.getElementById('close_button');

    // takes calendar to the next month
    next_bttn.addEventListener('click', () => {
        pos_month++;
        generate_calender();
    })

    // takes calendar back a month
    prev_bttn.addEventListener('click',  () => {
        pos_month--;
        generate_calender();
    })

    // allows tasks to be added for the corresponding date
    add_bttn.addEventListener('click', () => {
        if (task_input.value) {
            let new_task = {
                date: active_date,
                task_string: task_input.value,
            }

            data.tasks.push(new_task);  

            //clears input bar after adding tasks
            task_input.value = '';

            // the pop up and calendar are generated again to display the new tasks
            show_pop_up(active_date);
            generate_calender();
        }
    })

    close_bttn.addEventListener('click', () => {
        task_zone.innerHTML = '';
        // makes the pop up invisible again
        pop_up.style.display = 'none';
    })

}

function show_pop_up(date_string) {

    // ensures the pop up doesnt have the tasks from other dates still there
    task_zone.innerHTML = '';

    // the active date is kept a global variable so that the add task button can link the task to a date
    active_date = date_string;
    pop_up.style.display = 'block';
    const pop_up_title = document.getElementById("pop_up_header");
    pop_up_title.innerHTML = `Tasks: ${date_string}`;

    // gets the list of tasks associated for a the selected days date.
    const day_info = data.tasks.filter((day) => day.date === date_string);

    // adds the days tasks below the input bar in the pop up
    for (const items of day_info) {
        const my_task = document.createElement('div');
        my_task.innerText = items.task_string;
        my_task.classList.add('task');
        my_task.addEventListener('click', () => {
            remove_task(date_string, items.task_string);
        })
        task_zone.appendChild(my_task);
    }

}

function remove_task(date_string, task_string) {

    const task_index = data.tasks.findIndex((task) => task.date === date_string && task.task_string === task_string);

    // deletes a task that has been clicked in the pop up
    data.tasks.splice(task_index, 1);

    show_pop_up(date_string);
    generate_calender();
}

generate_calender();
buttons();

