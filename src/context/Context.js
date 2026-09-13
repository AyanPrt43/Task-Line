import React, { createContext, useContext } from "react"

const Context = createContext(
    
    {
        tasks: [
        {
            id: 1,
            task: "task msg",
            completed: false,
            important: false,
            date: null,
            deleted: false
        }
    ],

        themeMode: 'light',
        darkMode: () => {},
        lightMode: () => {},
        addTask: (task) => {},
        updateTask: (id, task) => {},
        deleteTask: (id) => {},
        permanentDeleteTask: (id) => {},
        restoreTask: (id) => {},
        toggleCompleted: (id) => {},
        toggleImportant: (id) => {},
        setTaskDate: (id, date) => {},
        filter: 'All',
        setFilter: (filter) => {},
        searchQuery: '',
        setSearchQuery: (query) => {},
        taskSortBy: 'default',
        setTaskSortBy: (sort) => {},
        userProfile: null,
        setUserProfile: (profile) => {},
    }
)

export const Provider = Context.Provider;

const useDataHook = () => {
    return useContext(Context);
}

export default useDataHook;