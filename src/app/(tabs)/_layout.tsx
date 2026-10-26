import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
        tabBarActiveTintColor: "#a85ef7",
        animation: "fade", 
        headerShown: false}}>
        <Tabs.Screen 
            name= "challenges" 
            options={{ 
                title: "Challenges",
                tabBarIcon:({color, size, focused})=>
                <Ionicons name={focused ? "checkmark" : "checkmark-outline"} color={color as string} size={size} /> 
            }} 
        />

        <Tabs.Screen 
            name="map" 
            options={{ 
                title: "Map",
                tabBarIcon:({color, size, focused})=>
                <Ionicons name={focused ? "map" : "map-outline"} color={color as string} size={size} /> 
            }} 
        />

        <Tabs.Screen 
            name="create" 
            options={{ 
                title: "Create",
                tabBarIcon:({color, size, focused})=>
                <Ionicons name={focused ? "create" : "create-outline"} color={color as string} size={size} /> 
            }} 
        />
        
        <Tabs.Screen 
            name="profile" 
            options={{ 
                title: "Profile",
                tabBarIcon:({color, size, focused})=>
                <Ionicons name={focused ? "person" : "person-outline"} color={color as string} size={size} />  
            }} 
        />
    </Tabs>
  )
}
