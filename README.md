## db schemas

### todos table
todos (
    id integer NOT NULL,
    text text,
    status character varying(255)
);

### todo history table
todo_history (
    id integer NOT NULL,
    action json,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    todo_id integer
);