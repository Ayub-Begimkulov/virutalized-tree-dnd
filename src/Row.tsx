import React, { memo, useMemo, useState } from 'react';
import { areEqual } from 'react-window';
import { ConnectDragSource, useDrag, useDrop } from 'react-dnd';
import { TreeItem, ItemTypes } from './utils';
import { useDebounce } from 'tiny-use-debounce';
import { useCombinedRef } from './use-combined-ref';
import { DropPositionMonitor } from './DragOverPositionMonitor';

export interface RowProps {
    style: React.CSSProperties;
    index: number;
    item: Omit<TreeItem, 'children'> & { depth: number };
    onExpand: (id: string) => void;
}

export const Row = memo(({ item, style, onExpand }: RowProps) => {
    return (
        <RowDraggingWrapper
            style={{
                paddingLeft: item.depth * 20,
                ...style,
            }}
            onInnerLongMouseOver={() => !item.expanded && onExpand(item.id)}
            className="row"
        >
            {drag => (
                <>
                    <div
                        ref={drag}
                        style={{
                            padding: 5,
                            marginRight: 5,
                            background: 'lightgreen',
                            borderRadius: 5,
                        }}
                    >
                        Drag me
                    </div>
                    <div onClick={() => onExpand(item.id)} style={{ flex: 1 }}>
                        {item.expanded ? 'v' : '>'}
                        &nbsp;
                        {item.title}
                    </div>
                </>
            )}
        </RowDraggingWrapper>
    );
}, areEqual);

const RowDraggingWrapper = ({
    className,
    style,
    children,
    onInnerLongMouseOver,
}: {
    className: string;
    style: React.CSSProperties;
    children: (drag: ConnectDragSource) => React.ReactNode;
    onInnerLongMouseOver: () => void;
}) => {
    const [dropPosition, setDropPosition] = useState<
        'top' | 'inner' | 'bottom' | null
    >(null);

    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: ItemTypes.LIST_ITEM,
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.LIST_ITEM,
        collect: monitor => ({
            isOver: monitor.isOver(),
        }),
    }));

    let styleDrop: React.CSSProperties = {};

    if (isOver) {
        switch (dropPosition) {
            case 'bottom':
                styleDrop = { borderBottom: '1px solid red' };
                break;
            case 'top':
                styleDrop = { borderTop: '1px solid red' };
                break;
            case 'inner':
                styleDrop = { background: 'red' };
                break;
        }
    }

    const childrenJSX = useMemo(() => children(drag), [drag]);

    const handleInnerLongMouseOver = useDebounce(() => {
        onInnerLongMouseOver();
    }, 1200);

    const onMouseLeave = () => {
        handleInnerLongMouseOver.cancel();
    };

    const combinedRef = useCombinedRef(preview, drop);

    return (
        <div
            ref={combinedRef}
            className={className}
            style={{ ...styleDrop, ...style, opacity: isDragging ? 0.7 : 1 }}
            onMouseLeave={onMouseLeave}
        >
            <DropPositionMonitor
                active={isOver}
                onDropInner={() => {
                    setDropPosition('inner');
                    handleInnerLongMouseOver();
                }}
                onDropUnder={() => setDropPosition('bottom')}
                onDropTop={() => setDropPosition('top')}
            />
            {childrenJSX}
        </div>
    );
};
