"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { countries } from "@/lib/countries";

export const CountrySelect = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] overflow-y-auto">
        {countries.map((country, idx) => (
          <SelectItem key={idx} value={country.name}>
            <div className="flex items-center gap-2">
              <Image
                src={`https://flagcdn.com/${country.flag}.svg`}
                alt={country.name}
                width={50}
                height={50}
                className="w-auto h-4.5 rounded-xs"
              />
              <span>{country.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
