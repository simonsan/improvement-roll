import * as React from 'react';
import Toast from 'react-native-simple-toast';
import generalCategory from '../categories/DefaultCategories';
import { Button, Icon, Text, Layout } from '@ui-kitten/components';

import { ThemeContext } from '../utility_components/theme-context';
import StyleSheetFactory from '../utility_components/styles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check, PERMISSIONS, RESULTS, checkMultiple } from 'react-native-permissions';

export default ({ route, navigation }) => {

  const themeContext = React.useContext(ThemeContext);
  const styleSheet = StyleSheetFactory.getSheet(themeContext.backgroundColor);

  // check for route params to show relevant toasts
  if (route.params != undefined) {
    switch (route.params.action) {
      case 'reset':
        Toast.show('Reset complete');
        AsyncStorage.setItem('categories', JSON.stringify([generalCategory]));
        break;
      default:
        Toast.show(
          `Category "${route.params.categoryName}" ${route.params.action}.`,
        );
        break;
    }
    route.params = undefined;
  }

  // on load check if there are categories. If not ass the general category.
  // check the theme and change it based on saved setting
  React.useEffect(() => {

    AsyncStorage.getAllKeys().then((value) => {
      if (value.indexOf('categories') == -1) {
        AsyncStorage.setItem('categories', JSON.stringify([generalCategory]));
      }

      if (value.indexOf('theme') >= 0) {
        AsyncStorage.getItem('theme').then((val) => {
          if (val == 'dark') {
            themeContext.toggleTheme();
          }
        });
      }
    });
  }, []);

  const RollIcon = (props) => <Icon name="flip-outline" {...props} />;
  const ListIcon = (props) => <Icon name="list-outline" {...props} />;
  const SettingsIcon = (props) => <Icon name="settings-2-outline" {...props} />;

  return (
    <Layout style={styleSheet.centered_container}>
      <Text style={{ marginTop: 100, fontWeight: 'bold' }} category="h1">
        Improvement
      </Text>
      <Text style={{ marginBottom: 100, fontWeight: 'bold' }} category="h1">
        Roll
      </Text>

      <Button
        accessoryLeft={RollIcon}
        onPress={() => navigation.navigate('Categories', { action: 'roll' })}>
        Roll
      </Button>
      <Button
        style={{ margin: 10 }}
        accessoryLeft={ListIcon}
        onPress={() => navigation.navigate('Categories', { action: 'view' })}>
        View Categories
      </Button>

      <Button
        accessoryLeft={SettingsIcon}
        onPress={() => navigation.navigate('Options')}>
        Options
      </Button>
    </Layout>
  );
}
