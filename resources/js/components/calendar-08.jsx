import * as React from "react";

import { Calendar } from "@components/ui/calendar";

export default function Calendar08({ value, onChange }) {
    return (
        <Calendar
            mode="single"
            defaultMonth={value || new Date()}
            selected={value}
            onSelect={onChange}
            disabled={{
                before: new Date(),
            }}
            className="rounded-lg border shadow-sm"
        />
    );
}
