import { Tree } from 'antd';
import { memo } from 'react';

type TreeDataProps = {
  title: string;
  key: number | string;
  children?: Array<TreeDataProps>;
};

export default memo(function AccessTree(props: {
  treeData: TreeDataProps[];
  value?: Array<string | number>;
  onChange?: (value: Array<string | number>) => void;
}) {
  // -- 获取父节点
  const getParentKeys = (
    tree: TreeDataProps[],
    func: (data: TreeDataProps) => boolean,
    path: string[] = [],
  ): Array<string | number> => {
    if (!tree) return [];
    for (const data of tree) {
      // -- 记录当前code
      path.push(data.key as string);
      // -- 判断当前code是否匹配
      if (func(data)) return path;
      // -- 判断当前对象是否存在children，如果存在，则递归遍历
      if (data.children) {
        const chs = getParentKeys(data.children, func, path);
        if (chs.length) return chs;
      }
      // -- 如果此前都没执行 return 语句，则将记录的当前code移除
      path.pop();
    }
    return [];
  };
  // -- 获取子节点
  const getChildrenKeys = (tree: TreeDataProps[], path: string[] = []) => {
    if (!tree) return [];
    tree.forEach((item) => {
      if (item.children) {
        path.push(item.key as string);
        getChildrenKeys(item.children, path);
      } else {
        path.push(item.key as string);
      }
    });
    return path;
  };
  // render
  return (
    <Tree<TreeDataProps>
      checkable
      treeData={props.treeData}
      checkedKeys={props.value}
      checkStrictly={true}
      onCheck={(obj: any, e: any) => {
        const curKey = e.node.key;
        // -- 选中
        if (e.checked) {
          const checkedKeys = obj.checked;
          const parentKeys = getParentKeys(
            props.treeData,
            (data) => data.key === curKey,
          );
          const childrenKeys = getChildrenKeys(e.node.children);
          const value = [
            ...new Set([...checkedKeys, ...parentKeys, ...childrenKeys]),
          ];
          props.onChange?.(value);
        } else {
          // -- 取消选中
          const chs = [curKey, ...getChildrenKeys(e.node.children)];
          const res = props.value
            ? props.value.filter(
                (item: string | number) => chs.indexOf(item) === -1,
              )
            : [];
          props.onChange?.([...res]);
        }
      }}
    />
  );
});
