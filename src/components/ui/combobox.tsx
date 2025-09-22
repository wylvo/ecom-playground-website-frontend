import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  type ComboboxData,
} from "@/components/ui/shadcn-io/combobox"
import { useState } from "react"

type ComboBoxProps = {
  data: ComboboxData[]
  type: string
  value: string
  onValueChange?: (value: string) => void
  className?: string
  disabled?: boolean
}

const ComboBox = ({
  data,
  type,
  value,
  onValueChange,
  className,
  disabled,
}: ComboBoxProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Combobox
      data={data}
      onOpenChange={setOpen}
      onValueChange={onValueChange}
      open={open}
      type={type}
      value={value}
    >
      <ComboboxTrigger disabled={disabled} className={className} />
      <ComboboxContent>
        <ComboboxInput />
        <ComboboxEmpty />
        <ComboboxList>
          <ComboboxGroup>
            {data.map((d) => (
              <ComboboxItem key={d.value} value={d.value}>
                {d.label}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
export default ComboBox
