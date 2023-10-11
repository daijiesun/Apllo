
import { ExecutionContext } from '@nestjs/common';

/**
 * 校验session中某个字段
*/

export const ValidateSessionField = (
  field: string,
): MethodDecorator => {
  return (
    target: Object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const ctx: ExecutionContext = args[0];
      const request = ctx.switchToHttp().getRequest();
      const session = request.session;

      if (!session || !session[field]) {
        throw new Error('Session validation failed');
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
};
