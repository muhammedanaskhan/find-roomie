"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "heydrabad",
    label: "Heydrabad",
  },
  {
    value: "bangalore",
    label: "Bangalore",
  },
  {
    value: "mumbai",
    label: "Mumbai",
  },
  {
    value: "chennai",
    label: "Chennai",
  },
  {
    value: "pune",
    label: "Pune",
  },
]

interface Props{
  onSelectValue: (value: string) => void
  fetchedCity: string | null
}
export function Dropdown({onSelectValue, fetchedCity}: Props) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(fetchedCity)

  React.useEffect(() => {
    setValue(fetchedCity);
  }, [fetchedCity]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select city..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[208px] p-0">
        <Command>
          <CommandInput placeholder="Search city..." className="h-9" />
          <CommandEmpty>No city found.</CommandEmpty>
          <CommandGroup>
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue: string) => {
                  setValue(currentValue === value ? "" : currentValue)
                  fetchedCity = null
                  setOpen(false)
                  onSelectValue(currentValue)
                }}
              >
                {framework.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === framework.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
