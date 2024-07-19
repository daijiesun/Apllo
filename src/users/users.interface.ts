// 用户角色枚举
export enum Role {
    superAdmin = 'SUPER_ADMIN',
    admin = 'ADMIN',
    visitor = 'VISITOR'
  }

export class UserRO {
    username: string
    phoneNum: string
    id: string
    role: string
}

// 分页查询
export interface SearchDto {
    username: string,
    phoneNum: string,
    isActive: string | boolean
}