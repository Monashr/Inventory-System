import React, { useState } from "react";

import { CheckIcon } from "lucide-react";

import { cn } from "@/components/lib/utils";

import { Input } from "../ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";

export function ComboBoxInput({
    options,
    value,
    onChange,
    placeholder = "Select or type...",
}) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");

    const handleSelect = (val) => {
        setInputValue(val);
        onChange(val);
        setOpen(false);
    };

    const filteredOptions = options
        .filter((option) =>
            option.toLowerCase().includes(inputValue.toLowerCase())
        )
        .slice(0, 5);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    role="button"
                    className="w-full"
                    onClick={() => setOpen(true)}
                >
                    <Input
                        value={inputValue}
                        placeholder={placeholder}
                        readOnly
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[300px]">
                <Command>
                    <CommandInput
                        placeholder=""
                        value={inputValue}
                        onValueChange={(val) => {
                            setInputValue(val);
                            onChange(val);
                        }}
                    />
                    <CommandEmpty>
                        No results. This new keyword will be the input
                    </CommandEmpty>
                    <CommandGroup>
                        {filteredOptions.map((option) => (
                            <CommandItem
                                key={option}
                                onSelect={() => handleSelect(option)}
                                className="cursor-pointer"
                            >
                                {option}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        option === inputValue
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
