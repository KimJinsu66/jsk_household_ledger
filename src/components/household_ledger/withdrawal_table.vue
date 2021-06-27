<template>
  <div class="withdrawal-main">
    <div class="withdrawal__link">
      <router-link to="/withdrawal/new">New</router-link>
    </div>

    <table class="withdrawal-table">
      <thead class="withdrawal-table__thead">
        <tr>
          <th>금액</th>
          <th>날짜</th>
          <th>카테고리</th>
          <th>메모</th>
        </tr>
      </thead>

      <tbody class="withdrawal-table__body">
        <tr v-for="widthDrawal in widthDrawals" :key="widthDrawal.id">
          <td> {{ widthDrawal.amountOfMoney }} </td>
          <td> {{ widthDrawal.date }}          </td>
          <td> {{ widthDrawal.category }}      </td>
          <td> {{ widthDrawal.memo }}          </td>
        </tr>
      </tbody>
    </table>  
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  data () {
    return {
      widthDrawals: [],
      db: firebase.firestore()
    }
  },
  created () {
    this.getWidthDrawal();
  },
  methods: {
    async getWidthDrawal () {
      await this.db.collection('withdrawals').where('email', '==', 'jinsu6688@gmail.com')
        .orderBy('date').get().then((querySnapshot) => {
          querySnapshot.forEach( (doc) => {
            this.widthDrawals.push(doc.data());
          });
        }).catch( (error) => {
          console.log(`データの取得に失敗しました (${error})`);
        });
    },
  }
}
</script>

<style lang="scss">
  .withdrawal {
    &-main {
      text-align: center;
      padding: 0 10%;
    }
    &__link {
      height: 50px;
      text-align: right;
      a {
        background-color: #FCCB5F;
        border-radius: 10px;
        padding: 8px 13px;
        font-size: 1.3rem;
        color: #ffffff;
      }
    }
    &-table {
      width: 100%;
      border: 1px solid #444444;
      border-collapse: collapse;
      th, td {
        border-bottom: 1px solid #444444;
        padding: 10px;
      }
      &__thead {
        background-color: #FCCB5F;
        color: #ffffff;
      }
    }
  }
</style>
