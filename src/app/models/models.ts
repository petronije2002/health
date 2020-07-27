export interface urlParameters{
    restaurant_id: string, 
    table_number: string, 
    restaurant_name: string 
}

export interface tokenRequest{
    uid: string
    restaurantID: string,
    restaurantName: string,
    tableNumber: string
    date: string
  }

  export interface event_ {

    isLogged: boolean,
    isAdmin: boolean,
    userName?: string,
    isSignedOut?: boolean,
    restaurantName?: string
  
  }