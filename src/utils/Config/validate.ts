export interface Permission {
  name: string;
  id: number;
  actions: string[];
}

export const validateActions = (
  permissions: Permission[],
  action: string
): string[] => {
  const values = permissions.find((p) => p.name === action);
  if (values) {
    return values.actions;
  } else {
    return [];
  }
};
