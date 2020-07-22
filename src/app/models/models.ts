export interface urlParameters{
    restaurant_id: string, 
    table_number: string, 
    restaurant_name: string 
}

export interface tokenRequest{
    uid: string
    parameters: Object
    date: string
  }

  export interface event_ {

    isLogged: boolean,
    isAdmin: boolean,
    userName?: string,
    isSignedOut?: boolean
  
  }