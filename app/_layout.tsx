import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#121212"
        },
        headerTintColor: "#fff"
      }}
    >
      <Stack.Screen name="index" options={{ title: "Login" }} />
      <Stack.Screen name="tutor" options={{title: "Área do Tutor"}}/>
      <Stack.Screen name="veterinario" options={{title: "Área do Veterinário"}}/>
      <Stack.Screen name="cadastro" options={{title: "Criar Conta"}}/>
      
    </Stack>
  );
}