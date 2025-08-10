import React from "react";

import { SearchIcon } from "lucide-react";

import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";

function CustomTableSearch({ search, setSearch, onSearch, placeholder }) {
    return (
        <div className="flex w-full max-w-sm items-center gap-2">
            <Input
                type="text"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <Button
                type="submit"
                variant="outline"
                className="cursor-pointer"
                onClick={onSearch}
            >
                <SearchIcon className="w-4 h-4" />
            </Button>
        </div>
    );
}

export default CustomTableSearch;
