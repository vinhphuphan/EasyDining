interface PinInputProps {
  length: number
  value: string
}

export function PinInput({ length, value }: PinInputProps) {
  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className="h-12 w-12 rounded-lg border-2 border-input bg-background flex items-center justify-center"
        >
          {value[index] && <div className="h-3 w-3 rounded-full bg-foreground" />}
        </div>
      ))}
    </div>
  )
}
