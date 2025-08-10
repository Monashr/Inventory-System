import React from "react";
import { Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

function CustomTableFilterButton({
    filterValues,
    currentFilters,
    setCurrentFilters,
    applyFilters,
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h1 className="leading-none font-medium">Filter</h1>
                    </div>
                    <div className="grid gap-2">
                        {Object.entries(filterValues).map(([key, values]) => (
                            <div
                                key={key}
                                className="grid grid-cols-3 items-center gap-4"
                            >
                                <Label htmlFor={key} className="capitalize">
                                    {key}
                                </Label>
                                <Select
                                    value={currentFilters[key] || ""}
                                    onValueChange={(value) =>
                                        setCurrentFilters((prev) => ({
                                            ...prev,
                                            [key]: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="col-span-2 h-8 w-full cursor-pointer">
                                        <SelectValue
                                            placeholder={`Select ${key}`}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {values.map((value) => (
                                            <SelectItem
                                                key={value}
                                                value={value}
                                                className="cursor-pointer"
                                            >
                                                {value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}

                        <Button
                            className="mt-2 cursor-pointer"
                            onClick={() => applyFilters(currentFilters)}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default CustomTableFilterButton;
