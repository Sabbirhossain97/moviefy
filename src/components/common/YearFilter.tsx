
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface YearFilterProps {
  selectedYear: number | undefined;
  onYearChange: (year: number | undefined) => void;
}

const YearFilter = ({ selectedYear, onYearChange }: YearFilterProps) => {
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    // Generate years from current year down to 1900
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let year = currentYear; year >= 1900; year--) {
      yearList.push(year);
    }
    setYears(yearList);
  }, []);

  const clearFilter = () => {
    onYearChange(undefined);
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedYear ? selectedYear.toString() : ""}
        onValueChange={(value) => onYearChange(value ? parseInt(value) : undefined)}
      >
        <SelectTrigger className="w-[100px] rounded-lg">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedYear && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilter}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default YearFilter;
