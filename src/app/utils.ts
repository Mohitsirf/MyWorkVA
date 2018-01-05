import {URLSearchParams} from '@angular/http';

export default class Utils {
  static objToSearchParams(obj): URLSearchParams {
    return Object.keys(obj).reduce((params: URLSearchParams, current) => {
      params.set(current, obj[current])
      return params;
    }, new URLSearchParams());
  }

  static normalize(entityArray: Entity[]) {
    return entityArray.reduce((entities: { [id: number]: Entity }, entity: Entity) => {
      return {
        ...entities, ...{
          [entity.id]: entity
        }
      };
    }, {});
  }

  static removeKey(obj, deleteKey) {
    return Object.keys(obj)
      .filter(key => key !== deleteKey)
      .reduce((result, current) => {
        result[current] = obj[current];
        return result;
      }, {});
  }

  // TODO: most methods in this file are not actually Utility methods, instead they are very specific to reducers
  // so move them to a better store specific place
  static removeRelationship(obj: { [id: number]: number[] }, relId: number) {
    return Object.keys(obj).reduce((result, current) => {
      result[current] = obj[current].filter((elem) => elem !== relId);
      return result;
    }, {});
  }

  static filterDuplicateIds(ids: number[]) {
    return ids.filter((elem, index, self) => index === self.indexOf(elem));
  }

  static getYoutubeUrlFromId(id: string): string {
    return 'https://www.youtube.com/watch?v=' + id;
  }
}

interface Entity {
  id: number;
}
