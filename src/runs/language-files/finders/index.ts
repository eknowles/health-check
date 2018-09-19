import arrayFinder from './array.finder';
import booleanFinder from './boolean.finder';
import functionFinder from './function.finder';
import numberFinder from './number.finder';

export default (data: string, filePath: string) => {
  const functionAnnotations = functionFinder(data, filePath);
  const arrayAnnotations = arrayFinder(data, filePath);
  const booleanAnnotations = booleanFinder(data, filePath);
  const numberAnnotations = numberFinder(data, filePath);

  return [
    ...functionAnnotations,
    ...arrayAnnotations,
    ...booleanAnnotations,
    ...numberAnnotations,
  ]
}
