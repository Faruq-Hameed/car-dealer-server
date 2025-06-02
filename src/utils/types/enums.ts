export enum UserStatusEnum {
  ACTIVE = "active",
  DELETED = "deleted",
}

export enum UserRoles {
  CUSTOMER='customer',
  MANAGER='manager',
  ADMIN='admin'
}

export enum CategoryStatus{
  AVAILABLE =  "available",
  DELETED = "deleted" //deleted means new car cannot be added but old cars added will still be seen
}