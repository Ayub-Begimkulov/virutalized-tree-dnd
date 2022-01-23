function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface TreeItem {
  id: string;
  title: string;
  expanded: boolean;
  children: TreeItem[];
}

const getId = () => Math.random().toString(36).slice(2);

export const getNestedTree = (depth = 0): TreeItem[] =>
  Array.from(
    { length: depth === 0 ? getRandomInt(100, 200) : getRandomInt(0, 50) },
    (_, index) => ({
      id: getId(),
      title: `${depth}-title-${index}`,
      expanded: false,
      children: depth === 0 ? getNestedTree(depth + 1) : [],
    })
  );

export const ItemTypes = {
  LIST_ITEM: "LIST_ITEM",
};
