import { useCallback, useMemo, useState } from "react";
import { useDrop } from "react-dnd";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, ListChildComponentProps } from "react-window";

import { CustomDragLayer } from "./CustomDragLayer";
import { Row } from "./Row";
import { getNestedTree, ItemTypes, TreeItem } from "./utils";

const ITEM_HEIGHT = 40;

const treeItems = getNestedTree();

export function Tree() {
  const [items, setItems] = useState(() => treeItems);

  const flatItems = useMemo(() => {
    const recurse = (
      items: TreeItem[],
      result: (Omit<TreeItem, "children"> & { depth: number })[] = [],
      depth = 0
    ) => {
      items.forEach((item) => {
        const { children, expanded, ...rest } = item;
        result.push({ ...rest, expanded, depth });

        if (!item.expanded) return;

        recurse(children, result, depth + 1);
      });
      return result;
    };
    return recurse(items);
  }, [items]);

  const onExpand = useCallback((id: string) => {
    setItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          return { ...item, expanded: !item.expanded };
        }
        return item;
      })
    );
  }, []);

  const renderItems = useCallback(
    ({ index, style }: ListChildComponentProps) => (
      <Row
        index={index}
        style={style}
        item={flatItems[index]}
        onExpand={onExpand}
      />
    ),
    [onExpand, flatItems]
  );

  useDrop(() => ({
    accept: ItemTypes.LIST_ITEM,
  }));

  return (
    <div className="tree">
      <CustomDragLayer />
      <AutoSizer>
        {({ width, height }) => (
          <FixedSizeList
            itemSize={ITEM_HEIGHT}
            itemCount={flatItems.length}
            width={width}
            height={height}
          >
            {renderItems}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
}
