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
          <th>삭제</th>
        </tr>
      </thead>

      <tbody class="withdrawal-table__body">
        <tr v-for="(widthDrawal, index) in widthDrawals" :key="widthDrawal.id">
          <td> {{ widthDrawal.amountOfMoney }} </td>
          <td> {{ widthDrawal.date }}          </td>
          <td> {{ widthDrawal.category }}      </td>
          <td> {{ widthDrawal.memo }}          </td>
          <td>
            <button 
              @click="deleteWidthDrawal(widthDrawal.id, index)" 
              class="withdrawal-table__delete-button"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <nav class="withdrawal-table__pagination">
      <ul>
        <li class="withdrawal-pagination__li">
          <div v-for="i in createPageNumbers()" v-bind:key=i>
            <a :href=createWithdrawalPaginationUrl(i) :class="isActivePage(i)">{{ i }}</a>
          </div>
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
      widthDrawalsLength: 1,
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
          this.widthDrawalsLength = querySnapshot.docs.length;
          console.log(querySnapshot);

          for (let i = this.startDataNumber(); i < this.limitDataNumber(querySnapshot.docs.length) ; i++) {
            this.widthDrawals.push(querySnapshot.docs[i].data());
            this.widthDrawals[i % 10].id = querySnapshot.docs[i].id;
          }
          console.log(this.widthDrawals);
        }).catch( (error) => {
          console.log(`データの取得に失敗しました (${error})`);
        });
    },
    async deleteWidthDrawal (id, index) {
      if (confirm('정말로 삭제하시겠습니까??')) {
        await this.db.collection("withdrawals").doc(id).delete().then(() => {
          this.widthDrawals.splice(index, 1);
          this.widthDrawalsLength = this.widthDrawalsLength - 1;
        }).catch((error) => {
          console.error("Error removing document: ", error);
        });
      }

      if(this.widthDrawals.length === 0) location.href(`/withdrawal?page=${this.currentPage - 1}`);
    },
    limitDataNumber (dataLength) {
      const limitNumber = this.currentPage * 10 ;
      if (dataLength < limitNumber) return dataLength;

      return limitNumber;
    },
    startDataNumber () {
      if (this.currentPage === 1) return 0;

      return (this.currentPage - 1) * 10;
    },
    createPageNumbers () {
      const widthDrawalsLength = this.widthDrawalsLength;
      const currentPage = parseInt(this.currentPage);
      let lastPageNumber = Math.floor(widthDrawalsLength / 10);
      let pageNumbers = [1];

      lastPageNumber = lastPageNumber % 10 === 0 ? lastPageNumber : lastPageNumber + 1;

      if (lastPageNumber < 2) return [1];

      if (lastPageNumber <= 5) {
        for(let i = 2; i < lastPageNumber + 1; i++) {
          pageNumbers.push(i);
        }
      }

      if (lastPageNumber > 5) {
        let startNumber = currentPage < 3 ? 2 : currentPage - 1; 
        let lastNumber  = currentPage > 4 ? currentPage + 1 : currentPage + 2;
        
        startNumber = lastPageNumber === currentPage ? currentPage - 2 : startNumber;
        lastNumber  = lastPageNumber === currentPage ? currentPage : lastNumber;
        
        for(let i = startNumber; i < lastNumber; i++) {
          pageNumbers.push(i);    
        }

        pageNumbers.push(lastPageNumber);
      }
      
      return pageNumbers;
    },
    createWithdrawalPaginationUrl (i) {
      return `/withdrawal?page=${i}`;
    },
    isActivePage (page) {
      console.log(page);
      if (parseInt(this.currentPage) === page) return {
        'withdrawal-pagination__link__active': true
      };
    }
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
      &__delete-button {
        padding: 10px 10px;
        background-color: #ff4500;
        color: #ffffff;
        border: none;
        border-radius: 5px;
      }
    }
    &-pagination {
      &__li {
        display: flex;
        justify-content: flex-end;
        div {
          // margin-right: 5px;
          font-size: 1.3rem;
          padding:10px;
        }
      }
      &__link__active {
        color: lighten(#0000ff, 20%);
        font-weight: bold;
      }
    }
  }
</style>
