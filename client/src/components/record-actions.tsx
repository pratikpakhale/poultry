import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from 'lucide-react'

interface RecordActionsProps {
  onEdit: () => void
  onDelete: () => void
}

export function RecordActions({ onEdit, onDelete }: RecordActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

