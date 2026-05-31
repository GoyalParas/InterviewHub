import { SignInButton, SignOutButton, Show, UserButton } from '@clerk/react';
import './App.css'

function App() {

  return (
    <>
      <h1>Welcome to InterviewHub</h1>
      <Show when="signed-out">
        <SignInButton mode="modal" >
          <button> Log In </button>
        </SignInButton>
      </Show>

      <Show when="signed-in">
        <SignOutButton />
      </Show>

      <UserButton />
    </>
  )
}

export default App
