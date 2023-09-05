import React, {useEffect, useState} from 'react'
import { uid } from 'react-uid';
import './AdminPage.css'
import UserInfo from './UserInfo/UserInfo'
import BlackList from './BlackList/BlackList'
import { editUserInfo, editBlacklist, updateUserList } from '../../actions/admin';

function AdminPage(){

    const state = {
        profilePicture:
                "https://st.depositphotos.com/2218212/2938/i/950/depositphotos_29387653-stock-photo-facebook-profile.jpg"
    };
    const [users, setUsers] = useState([]);
    const [blacklist, setBlacklist] = useState([]);

    useEffect(() => {
        updateUserList(setUsers, setBlacklist);
    }, [])
    
    function handleAdd(userName) {
        editBlacklist(userName, true, setUsers, setBlacklist);
    }

    function handleUpdate(userName, displayName, email, phone, coins){
        editUserInfo(userName, displayName, email, phone, coins, setUsers, setBlacklist);
    }

    function handleRemove(userName) {
        editBlacklist(userName, false, setUsers, setBlacklist);
    }

    function renderUsers(userList, blist) {
        try {
            return (
            <React.Fragment>
                { blist ? 
                    userList.map((u) => <BlackList key={ uid(u) } parentCallBack = {handleRemove} user={ u } profilePicture={ state.profilePicture }/>)
                    :
                    userList.map((u) => <UserInfo key={ uid(u) } parentCallBack = {handleAdd} parentUpdate={handleUpdate} user={ u } profilePicture={ state.profilePicture }/>) }
            </React.Fragment>
            )
        } catch (error) {
            return null;
        }
    }
    return(
        <div>
            <div className='userHeader'>Users</div>
            <div className='userContainer' key={ uid(users) }>
                { renderUsers(users, false) }
            </div>
            <div className='blackListHeader'>Blacklist</div>
            <div className='blacklistContainer' key={ uid(blacklist) }>
                { renderUsers(blacklist, true) }
            </div>
        </div>
    );
}

export default AdminPage;
