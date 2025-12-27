// navigation/TeacherStack.js
import { createStackNavigator } from '@react-navigation/stack';
import TeacherDashBoardScreen from '../screens/TeacherDashBoardScreen';
import UploadAssignmentsScreen from '../screens/UploadAssignmentsScreen';
import BlogUploadScreen from '../screens/BlogUploadScreen';
import ViewPortfolioScreen from '../screens/ViewPortfolioScreen';
import UpdateBlogScreen from '../screens/UpdateBlogScreen';
import { Button } from 'react-native-paper'; 


const Stack = createStackNavigator();

export default function TeacherStack({ onLogout }) {
  return (
     <Stack.Navigator>
      <Stack.Screen name="TeacherDashBoard" component={TeacherDashBoardScreen} options={{title: 'Teacher Dashboard',headerRight: () => (
            <Button onPress={onLogout} color="#6200ee" style={{ marginRight: 10 }}>
              Logout
            </Button>
          ),
        }}  />
      <Stack.Screen name="UploadAssignments" component={UploadAssignmentsScreen} />
      <Stack.Screen name="UploadBlog" component={BlogUploadScreen} />
      <Stack.Screen name="ViewPortfolio" component={ViewPortfolioScreen} />
      <Stack.Screen name="CreatedBlogs" component={UpdateBlogScreen} />
    </Stack.Navigator>
  );
}