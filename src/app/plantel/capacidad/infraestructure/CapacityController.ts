import { CapacityHandlerCase } from '../domain/usecases/CapacityHandlerCase';
import { CapacityGateway } from './CapacityGateway';

export class CapacityController {
  async getCapacity():Promise<number | null>{
    const res = await new CapacityHandlerCase(new CapacityGateway()).getPercentage();
    return res;
  }

  async updateCapacity(percentage:number):Promise<number | null>{
    const res = await new CapacityHandlerCase(new CapacityGateway()).updatePercentage(percentage);
    return res;
  }
}