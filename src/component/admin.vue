<template>
    <b-container fluid>
      <br/>
      <b-table striped hover responsive id="table" :items="items" :fields="fields">
        <template slot="delete" slot-scope="row">
          <b-button variant="outline-danger" size="sm" @click.stop="remove_user(row)" class="mr-2">
            <i class="fas fa-times"></i>
          </b-button>
         </template>
         <template slot="adjust_role" slot-scope="row">
           <b-button v-if="promote_demote(row.item.role) == 'promote'" variant="outline-success" size="sm" @click.stop="adjust_role(row)" class="mr-2">
            Promote
           </b-button>
           <b-button v-if="promote_demote(row.item.role) == 'demote'" variant="outline-danger" size="sm" @click.stop="adjust_role(row)" class="mr-2">
            Demote
           </b-button>
          </template>
      </b-table>

    </b-container>
</template>

<script>
import { router, db, users_ref, store } from '../main.js'

export default {
    firebase() {
      return {
        users: users_ref,
      }
    },
    data() {
      return {
        fields: [
          {
            key: 'id',
            label: "ID",
            sortable: true
          },
          {
            key: 'name',
            sortable: true
          },
          {
            key: 'role',
            sortable: true
          },
          {
            key: 'type',
            sortable: true
          },
          {
            key: 'adjust_role'
          },
          {
            key: 'delete',
          }
        ],
      }
    },
    computed: {
      items() {
        let table = [];
        this.users.forEach(user => {

          let id = user['.key']
          let name = user.display_name
          let role = user.role
          let type = user.product

          let item = {
            id: id,
            name: name,
            role: role,
            type: type,
          }

          table.push(item);
        })
        return table;
      }
    },
    methods: {
      remove_user(user) {
        let id = user.item.id;
        let name = user.item.name;
        let index = user.index;
        users_ref.child(id).once("value").then(snapshot => {
          let exists = snapshot.val() !== null
          if(exists) {
            var c = confirm("Are you sure to remove "+name+" from the database?")
            if(c) {
              users_ref.child(id).remove()
            } else {}
          } else {
            alert("User not found in the database. Please refresh your page!")
          }
        })
      },
      adjust_role(user) {
        let id = user.item.id;
        let name = user.item.name;
        let role = user.item.role;
        users_ref.child(id).once("value").then(snapshot => {
          let exists = snapshot.val() !== null
          if(exists) {
            if(snapshot.child('role').val() === role) {
              var c = confirm("Are you sure to "+this.promote_demote(role)+" "+ name+"?")
              if(c) {
                let new_role = role === 'user' ? 'admin' : 'user';
                snapshot.ref.update({
                  role: new_role
                })
              } else {}
            } else {
              alert("User role is not in sync with the database. Please refresh your page!")
            }
          } else {
            alert("User not found in the database. Please refresh your page!")
          }
        })
      },
      promote_demote(role) {
        if(role === 'user') return 'promote'
        else return 'demote'
      },
    },
}
</script>

<style>
#table {
  border: 3px solid Black;
}
</style>
