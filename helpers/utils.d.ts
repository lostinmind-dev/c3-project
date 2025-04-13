declare type Constructor<T extends abstract new (...args: any) => any> = new (...args: ConstructorParameters<T>) => InstanceType<T>;
