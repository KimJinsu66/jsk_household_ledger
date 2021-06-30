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
    <nav class="withdrawal-table__pagination">
      <ul>
        <li>
          <a href="/withdrawal?page=1">1</a>
          <a href="/withdrawal?page=2">2</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  data () {
    return {
      widthDrawals: [],
      currentPage: this.$route.query.page,
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
          for (let i = this.startDataNumber(); i < this.limitDataNumber(querySnapshot.docs.length) ; i++) {
            this.widthDrawals.push(querySnapshot.docs[i].data());
          }
        }).catch( (error) => {
          console.log(`データの取得に失敗しました (${error})`);
        });
    },
    limitDataNumber (dataLength) {
      const limitNumber = this.currentPage * 10 ;
      if (dataLength < limitNumber) return dataLength;

      return limitNumber;
    },
    startDataNumber () {
      if (this.currentPage === 1) return 0;

      return (this.currentPage - 1) * 10;
    }
  },
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
    &__pagination {
      display: flex;
    }
  }
</style>
