
export function get_user_role_as_string(user_role){
    if(user_role==='admin'){
        return 'Admin'
    }else if(user_role==='setter'){
        return 'Question Setter'
    }else if(user_role==='composer'){
        return 'Question Composer'
    }else{
        return 'Error'
    }
}