import { useEffect, useState } from 'react';
import { menusService, type MenuNode } from '@/services/menus.service';
import { storage } from '@/services/storage';

export function useMenus(activeOnly = true) {
  const [tree, setTree] = useState<MenuNode[]>(() =>
    activeOnly ? menusService.activeTree() : menusService.tree(),
  );

  useEffect(() => {
    const refresh = () =>
      setTree(activeOnly ? menusService.activeTree() : menusService.tree());
    refresh();
    return storage.subscribe(refresh);
  }, [activeOnly]);

  return tree;
}
