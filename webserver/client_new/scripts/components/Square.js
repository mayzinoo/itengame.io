"use strict";

define(['react', 'components/GraphicsContainer', 'components/ControlsSelector'], function (React, GraphicsContainerClass, ControlsSelectorClass) {
  var D = React.DOM;
  var GraphicsContainer = React.createFactory(GraphicsContainerClass);
  var ControlsSelector = React.createFactory(ControlsSelectorClass);
  var classMapping = {
    'C': 'emoji mine clicked',
    'M': 'emoji mine',
    'F': 'emoji flag',
    'W': 'emoji wrong',
    null: 'unrevealed'
  };
  var classMappingEasy = {
    'C': 'emoji mine clicked',
    'M': 'emoji mine new-mine',
    'F': 'emoji flag',
    'W': 'emoji wrong',
    null: 'unrevealed-easy'
  };
  var classMappingMedium = {
    'C': 'emoji mine clicked',
    'M': 'emoji new-mine',
    'F': 'emoji flag',
    'W': 'emoji wrong',
    null: 'unrevealed-medium'
  };
  var classMappingHard = {
    'C': 'emoji mine clicked',
    'M': 'emoji new-mine',
    'F': 'emoji flag',
    'W': 'emoji wrong',
    null: 'unrevealed-hard'
  };
  var classMappingExtreme = {
    'C': 'emoji mine clicked',
    'M': 'emoji new-mine',
    'F': 'emoji flag',
    'W': 'emoji wrong',
    null: 'unrevealed-extreme'
  };
  var classMappingNightmare = {
    'C': 'emoji mine clicked',
    'M': 'emoji new-mine',
    'F': 'emoji flag',
    'W': 'emoji wrong',
    null: 'unrevealed-nightmare'
  };
  var symbolMappingEasy = {
    'C': 'new-mine',
    'M': 'new-mine',
    'M\'': 'new-mine',
    '\'M': 'new-mine',
    'F': 'new-mine',
    'W': 'success-easy',
    '0': 'success-easy',
    '0\'': 'success-easy',
    '\'0': 'success-easy',
    '1': 'success-easy',
    '\'1': 'success-easy',
    '1\'': 'success-easy',
    '2': 'success-easy',
    '2\'': 'success-easy',
    '\'2': 'success-easy',
    '': 'success-easy'
  };
  var symbolMappingMedium = {
    'C': 'new-mine',
    'M': 'new-mine',
    'M\'': 'new-mine',
    '\'M': 'new-mine',
    'F': 'new-mine',
    'W': 'success-medium',
    '0': 'success-medium',
    '0\'': 'success-medium',
    '\'0': 'success-medium',
    '1': 'success-medium',
    '\'1': 'success-medium',
    '1\'': 'success-medium',
    '2': 'success-medium',
    '2\'': 'success-medium',
    '\'2': 'success-medium',
    '': 'success-medium'
  };
  var symbolMappingHard = {
    'C': 'new-mine',
    'M': 'new-mine',
    'M\'': 'new-mine',
    '\'M': 'new-mine',
    'F': 'new-mine',
    'W': 'success-hard',
    '0': 'success-hard',
    '0\'': 'success-hard',
    '\'0': 'success-hard',
    '1': 'success-hard',
    '\'1': 'success-hard',
    '1\'': 'success-hard',
    '2': 'success-hard',
    '2\'': 'success-hard',
    '\'2': 'success-hard',
    '': 'success-hard'
  };
  var symbolMappingExtreme = {
    'C': 'new-mine',
    'M': 'new-mine',
    'M\'': 'new-mine',
    '\'M': 'new-mine',
    'F': 'new-mine',
    'W': 'success-extreme',
    '0': 'success-extreme',
    '0\'': 'success-extreme',
    '\'0': 'success-extreme',
    '1': 'success-extreme',
    '\'1': 'success-extreme',
    '1\'': 'success-extreme',
    '2': 'success-extreme',
    '2\'': 'success-extreme',
    '\'2': 'success-extreme',
    '': 'success-extreme'
  };
  var symbolMappingNightmare = {
    'C': 'new-mine',
    'M': 'new-mine',
    'M\'': 'new-mine',
    '\'M': 'new-mine',
    'F': 'new-mine',
    'W': 'success-nightmare',
    '0': 'success-nightmare',
    '0\'': 'success-nightmare',
    '\'0': 'success-nightmare',
    '1': 'success-nightmare',
    '\'1': 'success-nightmare',
    '1\'': 'success-nightmare',
    '2': 'success-nightmare',
    '2\'': 'success-nightmare',
    '\'2': 'success-nightmare',
    '': 'success-nightmare'
  };

  var getSymbolEasy = function getSymbolEasy(value) {
    return symbolMappingEasy[value] || (value ? value : '');
  };

  var getSymbolMedium = function getSymbolMedium(value) {
    return symbolMappingMedium[value] || (value ? value : '');
  };

  var getSymbolHard = function getSymbolHard(value) {
    return symbolMappingHard[value] || (value ? value : '');
  };

  var getSymbolExtreme = function getSymbolExtreme(value) {
    return symbolMappingExtreme[value] || (value ? value : '');
  };

  var getSymbolNightmare = function getSymbolNightmare(value) {
    return symbolMappingNightmare[value] || (value ? value : '');
  };

  var getClass = function getClass(value) {
    return classMapping[value] || 'revealed number' + value;
  };

  var getClassEasy = function getClassEasy(value) {
    return classMappingEasy[value] || 'success-easy ' + value;
  };

  var getClassMedium = function getClassMedium(value) {
    return classMappingMedium[value] || 'success-medium ' + value;
  };

  var getClassHard = function getClassHard(value) {
    return classMappingHard[value] || 'success-hard ' + value;
  };

  var getClassExtreme = function getClassExtreme(value) {
    return classMappingExtreme[value] || 'success-extreme ' + value;
  };

  var getClassNightmare = function getClassNightmare(value) {
    return classMappingNightmare[value] || 'success-nightmare ' + value;
  };

  return React.createClass({
    displayName: 'Square',
    propTypes: {
      id: React.PropTypes.number.isRequired,
      dd: React.PropTypes.number.isRequired,
      data0: React.PropTypes.array.isRequired,
      data1: React.PropTypes.array.isRequired,
      data2: React.PropTypes.array.isRequired,
      data3: React.PropTypes.array.isRequired,
      data4: React.PropTypes.array.isRequired,
      data5: React.PropTypes.array.isRequired,
      data6: React.PropTypes.array.isRequired,
      data7: React.PropTypes.array.isRequired,
      data8: React.PropTypes.array.isRequired,
      gstatus: React.PropTypes.string.isRequired,
      width: React.PropTypes.number.isRequired,
      key: React.PropTypes.string.isRequired,
      value: React.PropTypes.number.isRequired,
      level: React.PropTypes.string.isRequired
    },
    render: function render() {
      if (this.props.id === 0) {
        var skey = this.props.dd;
        var names_zero = this.props.data0;
        names_zero = "'" + names_zero + "'";
        var nameArr_0 = names_zero.split(',');

        if (skey === 0) {
          var result = nameArr_0[0];
        } else if (skey === 1) {
          var result = nameArr_0[1];
        } else if (skey === 2) {
          var result = nameArr_0[2];
        } else {
          var result = nameArr_0[3];
        }

        var level = this.props.level;
        var getfruit;
        var getclass;
        var getvalue;

         if (level === 'Newbie') {
          getfruit = getSymbolMedium(result);
          getvalue = getSymbolMedium(this.props.value);
          getclass = getClassMedium(this.props.value);
        } else if (level === 'Classic') {
          getfruit = getSymbolHard(result);
          getvalue = getSymbolHard(this.props.value);
          getclass = getClassHard(this.props.value);
        } else if (level === 'Hard') {
          getfruit = getSymbolExtreme(result);
          getvalue = getSymbolExtreme(this.props.value);
          getclass = getClassExtreme(this.props.value);
        } else {
          getfruit = getSymbolNightmare(result);
          getvalue = getSymbolNightmare(this.props.value);
          getclass = getClassNightmare(this.props.value);
        }

        if (this.props.width === 4) {
          return D.button({
            className: "gfour Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else if (this.props.width === 3) {
          return D.button({
            className: "gthree Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else {
          return D.button({
            className: "gtwo Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        }
      } else if (this.props.id === 1) {
        var skey = this.props.dd;
        var names_one = this.props.data1;
        names_one = "'" + names_one + "'";
        var nameArr_1 = names_one.split(',');

        if (skey === 0) {
          var result = nameArr_1[0];
        } else if (skey === 1) {
          var result = nameArr_1[1];
        } else if (skey === 2) {
          var result = nameArr_1[2];
        } else {
          var result = nameArr_1[3];
        }

        var level = this.props.level;
        var getfruit;
        var getclass;
        var getvalue;

       if (level === 'Newbie') {
          getfruit = getSymbolMedium(result);
          getvalue = getSymbolMedium(this.props.value);
          getclass = getClassMedium(this.props.value);
        } else if (level === 'Classic') {
          getfruit = getSymbolHard(result);
          getvalue = getSymbolHard(this.props.value);
          getclass = getClassHard(this.props.value);
        } else if (level === 'Hard') {
          getfruit = getSymbolExtreme(result);
          getvalue = getSymbolExtreme(this.props.value);
          getclass = getClassExtreme(this.props.value);
        } else {
          getfruit = getSymbolNightmare(result);
          getvalue = getSymbolNightmare(this.props.value);
          getclass = getClassNightmare(this.props.value);
        }

        if (this.props.width === 4) {
          return D.button({
            className: "gfour Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else if (this.props.width === 3) {
          return D.button({
            className: "gthree Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else {
          return D.button({
            className: "gtwo Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        }
      } else if (this.props.id === 2) {
        var skey = this.props.dd;
        var names_two = this.props.data2;
        names_two = "'" + names_two + "'";
        var nameArr_2 = names_two.split(',');

        if (skey === 0) {
          var result = nameArr_2[0];
        } else if (skey === 1) {
          var result = nameArr_2[1];
        } else if (skey === 2) {
          var result = nameArr_2[2];
        } else {
          var result = nameArr_2[3];
        }

        var level = this.props.level;
        var getfruit;
        var getclass;
        var getvalue;

         if (level === 'Newbie') {
          getfruit = getSymbolMedium(result);
          getvalue = getSymbolMedium(this.props.value);
          getclass = getClassMedium(this.props.value);
        } else if (level === 'Classic') {
          getfruit = getSymbolHard(result);
          getvalue = getSymbolHard(this.props.value);
          getclass = getClassHard(this.props.value);
        } else if (level === 'Hard') {
          getfruit = getSymbolExtreme(result);
          getvalue = getSymbolExtreme(this.props.value);
          getclass = getClassExtreme(this.props.value);
        } else {
          getfruit = getSymbolNightmare(result);
          getvalue = getSymbolNightmare(this.props.value);
          getclass = getClassNightmare(this.props.value);
        }

        if (this.props.width === 4) {
          return D.button({
            className: "gfour Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else if (this.props.width === 3) {
          return D.button({
            className: "gthree Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else {
          return D.button({
            className: "gtwo Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        }
      } else if (this.props.id === 3) {
        var skey = this.props.dd;
        var names_two = this.props.data3;
        names_two = "'" + names_two + "'";
        var nameArr_3 = names_two.split(',');

        if (skey === 0) {
          var result = nameArr_3[0];
        } else if (skey === 1) {
          var result = nameArr_3[1];
        } else if (skey === 2) {
          var result = nameArr_3[2];
        } else {
          var result = nameArr_3[3];
        }

        var level = this.props.level;
        var getfruit;
        var getclass;
        var getvalue;        

        if (level === 'Newbie') {
          getfruit = getSymbolMedium(result);
          getvalue = getSymbolMedium(this.props.value);
          getclass = getClassMedium(this.props.value);
        } else if (level === 'Classic') {
          getfruit = getSymbolHard(result);
          getvalue = getSymbolHard(this.props.value);
          getclass = getClassHard(this.props.value);
        } else if (level === 'Hard') {
          getfruit = getSymbolExtreme(result);
          getvalue = getSymbolExtreme(this.props.value);
          getclass = getClassExtreme(this.props.value);
        } else {
          getfruit = getSymbolNightmare(result);
          getvalue = getSymbolNightmare(this.props.value);
          getclass = getClassNightmare(this.props.value);
        }

        if (this.props.width === 4) {
          return D.button({
            className: "gfour Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else if (this.props.width === 3) {
          return D.button({
            className: "gthree Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else {
          return D.button({
            className: "gtwo Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        }
      } else if (this.props.id === 4) {
        var skey = this.props.dd;
        var names_two = this.props.data4;
        names_two = "'" + names_two + "'";
        var nameArr_3 = names_two.split(',');

        if (skey === 0) {
          var result = nameArr_3[0];
        } else if (skey === 1) {
          var result = nameArr_3[1];
        } else if (skey === 2) {
          var result = nameArr_3[2];
        } else {
          var result = nameArr_3[3];
        }

        var level = this.props.level;
        var getfruit;
        var getclass;
        var getvalue;

        if (level === 'Newbie') {
          getfruit = getSymbolMedium(result);
          getvalue = getSymbolMedium(this.props.value);
          getclass = getClassMedium(this.props.value);
        } else if (level === 'Classic') {
          getfruit = getSymbolHard(result);
          getvalue = getSymbolHard(this.props.value);
          getclass = getClassHard(this.props.value);
        } else if (level === 'Hard') {
          getfruit = getSymbolExtreme(result);
          getvalue = getSymbolExtreme(this.props.value);
          getclass = getClassExtreme(this.props.value);
        } else {
          getfruit = getSymbolNightmare(result);
          getvalue = getSymbolNightmare(this.props.value);
          getclass = getClassNightmare(this.props.value);
        }

        if (this.props.width === 4) {
          return D.button({
            className: "gfour Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else if (this.props.width === 3) {
          return D.button({
            className: "gthree Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else {
          return D.button({
            className: "gtwo Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        }
      } else if (this.props.id === 5) {
        var skey = this.props.dd;
        var names_two = this.props.data5;
        names_two = "'" + names_two + "'";
        var nameArr_3 = names_two.split(',');

        if (skey === 0) {
          var result = nameArr_3[0];
        } else if (skey === 1) {
          var result = nameArr_3[1];
        } else if (skey === 2) {
          var result = nameArr_3[2];
        } else {
          var result = nameArr_3[3];
        }

        var level = this.props.level;
        var getfruit;
        var getclass;
        var getvalue;

         if (level === 'Newbie') {
          getfruit = getSymbolMedium(result);
          getvalue = getSymbolMedium(this.props.value);
          getclass = getClassMedium(this.props.value);
        } else if (level === 'Classic') {
          getfruit = getSymbolHard(result);
          getvalue = getSymbolHard(this.props.value);
          getclass = getClassHard(this.props.value);
        } else if (level === 'Hard') {
          getfruit = getSymbolExtreme(result);
          getvalue = getSymbolExtreme(this.props.value);
          getclass = getClassExtreme(this.props.value);
        } else {
          getfruit = getSymbolNightmare(result);
          getvalue = getSymbolNightmare(this.props.value);
          getclass = getClassNightmare(this.props.value);
        }

        if (this.props.width === 4) {
          return D.button({
            className: "gfour Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else if (this.props.width === 3) {
          return D.button({
            className: "gthree Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else {
          return D.button({
            className: "gtwo Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        }
      } else if (this.props.id === 6) {
        var skey = this.props.dd;
        var names_two = this.props.data6;
        names_two = "'" + names_two + "'";
        var nameArr_3 = names_two.split(',');

        if (skey === 0) {
          var result = nameArr_3[0];
        } else if (skey === 1) {
          var result = nameArr_3[1];
        } else if (skey === 2) {
          var result = nameArr_3[2];
        } else {
          var result = nameArr_3[3];
        }

        var level = this.props.level;
        var getfruit;
        var getclass;
        var getvalue;        

        if (level === 'Newbie') {
          getfruit = getSymbolMedium(result);
          getvalue = getSymbolMedium(this.props.value);
          getclass = getClassMedium(this.props.value);
        } else if (level === 'Classic') {
          getfruit = getSymbolHard(result);
          getvalue = getSymbolHard(this.props.value);
          getclass = getClassHard(this.props.value);
        } else if (level === 'Hard') {
          getfruit = getSymbolExtreme(result);
          getvalue = getSymbolExtreme(this.props.value);
          getclass = getClassExtreme(this.props.value);
        } else {
          getfruit = getSymbolNightmare(result);
          getvalue = getSymbolNightmare(this.props.value);
          getclass = getClassNightmare(this.props.value);
        }

        if (this.props.width === 4) {
          return D.button({
            className: "gfour Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else if (this.props.width === 3) {
          return D.button({
            className: "gthree Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else {
          return D.button({
            className: "gtwo Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        }
      } else if (this.props.id === 7) {
        var skey = this.props.dd;
        var names_two = this.props.data7;
        names_two = "'" + names_two + "'";
        var nameArr_3 = names_two.split(',');

        if (skey === 0) {
          var result = nameArr_3[0];
        } else if (skey === 1) {
          var result = nameArr_3[1];
        } else if (skey === 2) {
          var result = nameArr_3[2];
        } else {
          var result = nameArr_3[3];
        }

        var level = this.props.level;
        var getfruit;
        var getclass;
        var getvalue;

        if (level === 'Newbie') {
          getfruit = getSymbolMedium(result);
          getvalue = getSymbolMedium(this.props.value);
          getclass = getClassMedium(this.props.value);
        } else if (level === 'Classic') {
          getfruit = getSymbolHard(result);
          getvalue = getSymbolHard(this.props.value);
          getclass = getClassHard(this.props.value);
        } else if (level === 'Hard') {
          getfruit = getSymbolExtreme(result);
          getvalue = getSymbolExtreme(this.props.value);
          getclass = getClassExtreme(this.props.value);
        } else {
          getfruit = getSymbolNightmare(result);
          getvalue = getSymbolNightmare(this.props.value);
          getclass = getClassNightmare(this.props.value);
        }

        if (this.props.width === 4) {
          return D.button({
            className: "gfour Square  ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else if (this.props.width === 3) {
          return D.button({
            className: "gthree Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else {
          return D.button({
            className: "gtwo Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        }
      } else {
        var skey = this.props.dd;
        var names_two = this.props.data8;
        names_two = "'" + names_two + "'";
        var nameArr_3 = names_two.split(',');

        if (skey === 0) {
          var result = nameArr_3[0];
        } else if (skey === 1) {
          var result = nameArr_3[1];
        } else if (skey === 2) {
          var result = nameArr_3[2];
        } else {
          var result = nameArr_3[3];
        }

        var level = this.props.level;
        var getfruit;
        var getclass;
        var getvalue;

        if (level === 'Newbie') {
          getfruit = getSymbolMedium(result);
          getvalue = getSymbolMedium(this.props.value);
          getclass = getClassMedium(this.props.value);
        } else if (level === 'Classic') {
          getfruit = getSymbolHard(result);
          getvalue = getSymbolHard(this.props.value);
          getclass = getClassHard(this.props.value);
        } else if (level === 'Hard') {
          getfruit = getSymbolExtreme(result);
          getvalue = getSymbolExtreme(this.props.value);
          getclass = getClassExtreme(this.props.value);
        } else {
          getfruit = getSymbolNightmare(result);
          getvalue = getSymbolNightmare(this.props.value);
          getclass = getClassNightmare(this.props.value);
        }

        if (this.props.width === 4) {
          return D.button({
            className: "gfour Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else if (this.props.width === 3) {
          return D.button({
            className: "gthree Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        } else {
          return D.button({
            className: "gtwo Square ".concat(this.props.gstatus === 'fail' ? getfruit : getclass),
            onClick: this.props.onClick
          });
        }
      }
    }
  });
});