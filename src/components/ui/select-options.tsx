import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select"
import { Label } from "@/components/ui/shadcn/label"

type SelectOptionsData = {
  label?: string
  value: string
}[]

type SelectOptionsProps = {
  data: SelectOptionsData
  label?: string
  selectLabel?: string
  placeholder?: string
  defaultValue?: string
  onValueChange?(value: string): void
}

export type SelectedOptions = Record<string, string>

export function SelectOptions({
  data,
  label,
  selectLabel,
  placeholder,
  onValueChange,
  defaultValue,
}: SelectOptionsProps) {
  return (
    <>
      <Label>{label ? label : "Label"}</Label>
      <Select onValueChange={onValueChange} defaultValue={defaultValue}>
        <SelectTrigger className="w-[180px]">
          <SelectValue
            placeholder={placeholder ? placeholder : "Placeholder"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {selectLabel && <SelectLabel>{selectLabel}</SelectLabel>}
            {data &&
              data.map((data, i) => (
                <SelectItem key={i} value={String(data.value)}>
                  {data.value}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  )
}
