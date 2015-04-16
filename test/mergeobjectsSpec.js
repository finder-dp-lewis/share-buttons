/*global describe, it, expect*/
var mergeobjects = require('../src/util/mergeobjects.js');

describe('mergeobjects', function () {
  var obj1, obj2;

  obj1 = {
    'firstname': 'Winnie',
    'lastname': 'Pooh',
    'job': 'bear'
  };

  obj2 = {
    'firstname': 'Roger',
    'lastname': 'Rabbit'
  };

  it('should equal fixture contents', function () {
    var newObject = mergeobjects(obj1, obj2);
    expect(newObject.firstname).toEqual('Roger');
    expect(newObject.lastname).toEqual('Rabbit');
    expect(newObject.job).toEqual('bear');
  });

});
