import {BaseDto} from './dto';


export abstract class BaseResourceService<T extends BaseDto> {

  protected url: string;

  constructor(protected $http: ng.IHttpService, resourceName: string) {
    this.url = `/api/${resourceName}`;
  }

  createOne(data: T): Promise<T> {
    const body = JSON.stringify(data);
    return this.$http.post(this.url, body);
  }

  updateOne(data: T): Promise<T> {
    const body = JSON.stringify(data);
    return this.$http.put(`${this.url}/${data._id}`, body);
  }

  removeOneById(id: string): Promise<T> {
    return this.$http.delete(`${this.url}/${id}`);
  }

  findOneById(id: string): Promise<T> {
    return this.$http.get(`${this.url}/${id}`);
  }

  find(): Promise<T[]> {
    return this.$http.get(`${this.url}/_find`);
  }

}

