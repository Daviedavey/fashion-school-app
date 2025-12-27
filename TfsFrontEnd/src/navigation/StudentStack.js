import { createStackNavigator } from '@react-navigation/stack';
import DashBoardScreen from '../screens/DashBoardScreen';
import AssignmentsScreen from '../screens/AssignmentsScreen';
import AgendaScreen from '../screens/AgendaScreen';
import BlogScreen from '../screens/BlogScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import AssignmentDetailScreen from '../screens/AssignmentDetailScreen';
import { Button } from 'react-native-paper';



// navigation/StudentStack.js
const Stack = createStackNavigator();
export default function StudentStack({ onLogout }) {
  return (
    <Stack.Navigator>
     <Stack.Screen name="DashBoard" component={DashBoardScreen} options={{
          title: 'Dashboard',
          headerRight: () => (
            <Button onPress={onLogout} color="#6200ee" style={{ marginRight: 10 }}>
              Logout
            </Button>
          ),
        }} />
     <Stack.Screen name="Assignments" component={AssignmentsScreen} />
     <Stack.Screen name="Agenda" component={AgendaScreen} />
     <Stack.Screen name="Blog" component={BlogScreen} />
     <Stack.Screen name="Favourites" component={FavouritesScreen} />
     <Stack.Screen name="Portfolio" component={PortfolioScreen} />
      <Stack.Screen name="AssignmentDetail" component={AssignmentDetailScreen} options={{ title: 'Details' }} // Set a default title for the header
      />
    </Stack.Navigator>
  );
}