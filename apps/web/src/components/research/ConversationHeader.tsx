import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Pencil1Icon } from "@radix-ui/react-icons"

interface ConversationHeaderProps {
  title?: string
  onTitleChange?: (newTitle: string) => void
}

export function ConversationHeader({ title = '', onTitleChange }: ConversationHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onTitleChange && editedTitle.trim()) {
      onTitleChange(editedTitle.trim())
    }
    setIsEditing(false)
  }

  return (
    <div className="border-b p-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Enter conversation title..."
              className="max-w-md"
              autoFocus
            />
            <Button 
              type="submit" 
              size="sm"
              disabled={!editedTitle.trim()}
            >
              Save
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setEditedTitle(title)
                setIsEditing(false)
              }}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">
              {title.trim() || 'Untitled Conversation'}
            </h1>
            {onTitleChange && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  setEditedTitle(title)
                  setIsEditing(true)
                }}
              >
                <Pencil1Icon className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 