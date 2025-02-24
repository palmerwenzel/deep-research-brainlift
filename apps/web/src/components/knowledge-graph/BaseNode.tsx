'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KnowledgeGraphNode } from '@/types/knowledge-graph';

type BaseNodeProps = NodeProps<KnowledgeGraphNode['data']>;

const typeColors = {
  domain: 'bg-blue-100 dark:bg-blue-900',
  area: 'bg-purple-100 dark:bg-purple-900',
  concept: 'bg-green-100 dark:bg-green-900',
  aspect: 'bg-amber-100 dark:bg-amber-900',
};

export default function BaseNode({ data, type, isConnectable = true }: BaseNodeProps) {
  return (
    <Card className={cn('min-w-[200px] p-4', typeColors[type as keyof typeof typeColors])}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!bg-muted-foreground"
      />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{data.name}</h3>
          {data.dok_score !== undefined && (
            <Badge variant="secondary">DoK: {data.dok_score}</Badge>
          )}
        </div>

        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!bg-muted-foreground"
      />
    </Card>
  );
} 