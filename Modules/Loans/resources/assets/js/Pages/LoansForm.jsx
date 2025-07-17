import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X } from "lucide-react";

export default function LoansForm({ items }) {
  const [unitEntries, setUnitEntries] = useState([]);

  const { data, setData, processing } = useForm({
    name: "",
    description: "",
    units: [],
  });

  const handleAddUnitEntry = () => {
    setUnitEntries((prev) => [
      ...prev,
      {
        item_id: "",
        unit_id: "",
        return_date: "",
        due_date: "",
        units: [],
      },
    ]);
  };

  const handleRemoveUnitEntry = (index) => {
    setUnitEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchUnits = async (itemId, index) => {
    try {
      const response = await fetch(`/dashboard/items/api/${itemId}/unit`);
      const units = await response.json();

      setUnitEntries((prev) =>
        prev.map((entry, i) =>
          i === index ? { ...entry, units, unit_id: "" } : entry
        )
      );
    } catch (error) {
      console.error("Failed to fetch units:", error);
    }
  };

  const handleItemChange = async (index, itemId) => {
    setUnitEntries((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, item_id: itemId } : entry
      )
    );
    await fetchUnits(itemId, index);
  };

  const handleFieldChange = (index, field, value) => {
    setUnitEntries((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    router.post(
      "/dashboard/loans",
      {
        name: data.name,
        description: data.description,
        units: unitEntries,
      },
      { preserveScroll: true }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Loan Name</Label>
          <Input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            type="text"
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Loaned Units</h2>

        {unitEntries.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No units added yet. Click &quot;Add Unit&quot; to begin.
          </p>
        )}

        <div className="space-y-6">
          {unitEntries.map((entry, index) => (
            <Card key={index} className="relative">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
                onClick={() => handleRemoveUnitEntry(index)}
              >
                <X className="w-4 h-4" />
              </Button>

              <CardHeader>
                <CardTitle>Unit #{index + 1}</CardTitle>
              </CardHeader>

              <CardContent className="grid gap-4">
                <div>
                  <Label>Item</Label>
                  <Select
                    value={entry.item_id}
                    onValueChange={(val) => handleItemChange(index, val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Unit</Label>
                  <Select
                    value={entry.unit_id}
                    onValueChange={(val) =>
                      handleFieldChange(index, "unit_id", val)
                    }
                    disabled={!entry.units.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {entry.units.map((unit) => (
                        <SelectItem key={unit.id} value={String(unit.id)}>
                          {unit.unit_code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Return Date</Label>
                    <Input
                      type="date"
                      value={entry.return_date}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "return_date",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={entry.due_date}
                      onChange={(e) =>
                        handleFieldChange(index, "due_date", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          type="button"
          onClick={handleAddUnitEntry}
          variant="outline"
          className="w-full md:w-auto"
        >
          + Add Unit
        </Button>
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={processing} className="w-full md:w-auto">
          Save Loan
        </Button>
      </div>
    </form>
  );
}
