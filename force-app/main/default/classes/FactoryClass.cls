@IsTest
public class FactoryClass {

    /*
    *********************************************************
    @method         : createTestData
    @description    : Génère des enregistrements de test pour Account, Opportunity, et Trip__c
    @return         : FactoryTest contenant les objets créés
    *********************************************************
    */

    public static Account createAccountTestData () {
        
      Account testAccount = new Account(
            Name = 'Test Account for Factory Usage',
            Phone = '68',
            Industry = 'Apparel',
            CurrencyIsoCode = 'CHF'
      );
        insert testAccount;
        return testAccount;

    }

    public static Contract createContractTestData () {
        
      Account testAccount = new Account(
            Name = 'Test Account for Factory Usage',
            Phone = '68',
            Industry = 'Apparel',
            CurrencyIsoCode = 'CHF'
      );
        insert testAccount;
      
      Contract testContract = new Contract (
            AccountId = testAccount.Id,
            Status = 'Draft',
            StartDate = Date.today(),
            ContractTerm = 4,
            CurrencyIsoCode = 'CHF'
      );
        insert testContract;
        return testContract;
     }

     public static Opportunity createOppTestData () {

      Account testAccount = new Account(
            Name = 'Test Account for Factory Usage',
            Phone = '68',
            Industry = 'Apparel',
            CurrencyIsoCode = 'CHF'
      );
        insert testAccount;

      Opportunity testOpp = new Opportunity(
            Name = 'Test Opportunity for Factory Usage',
            StageName = 'Prospecting',
            CloseDate = Date.today(),
            Amount = 47,
            Destination__c = 'suisse',
            AccountId = testAccount.Id
      );
      insert testOpp;
      return testOpp;
     }

     public static Trip__c createTrpTestData () {

      Account testAccount = new Account(
            Name = 'Test Account for Factory Usage',
            Phone = '68',
            Industry = 'Apparel',
            CurrencyIsoCode = 'CHF'
      );
        insert testAccount;

      Trip__c testTrip = new Trip__c(
            Status__c = 'Terminé',
            Destination__c = 'suisse',
            Start_Date__c = Date.newInstance(2023, 5, 25),
            End_Date__c = Date.newInstance(2024, 5, 25),
            Number_of_Participants__c = 14,
            Account__c = testAccount.Id
      );
      insert testTrip;
      return testTrip;
     }

    public static List<Trip__c> createTestData() {
      
        Account testAccount = new Account(
            Name = 'Test Account for Factory Usage',
            Client_Type_2__c = 'Particulier',
            ShippingStreet = 'Route des montagnes 101',
            ShippingCity = 'Lausanne',
            ShippingPostalCode = '1000',
            ShippingCountry = 'Suisse'
        );
        insert testAccount;

        Opportunity testOpp = new Opportunity(
            Name = 'Test Opportunity for Factory Usage',
            StageName = 'Prospecting',
            CloseDate = System.today().addDays(30),
            Number_of_Participants__c = 14,
            Destination__c = 'Somewhere',
            Start_Date__c = Date.newInstance(2025, 5, 28),
            End_Date__c = Date.newInstance(2025, 5, 27),
            Amount = 12000,
            AccountId = testAccount.Id
        );
        insert testOpp;

        Trip__c TestTripMixDates = new Trip__c (

            Start_Date__c = Date.newInstance(2025, 5, 28),
            End_Date__c = Date.newInstance(2025, 5, 27),
            Number_of_Participants__c = 11
        );

          Trip__c TestTripCancelled = new Trip__c (

            Start_Date__c = Date.newInstance(2025, 5, 25),
            End_Date__c = Date.newInstance(2025, 5, 27),
            Number_of_Participants__c = 7
        );

          Trip__c TestTripComing = new Trip__c (

            Start_Date__c = Date.today().addDays(1),
            End_Date__c = Date.today().addDays(3),
            Number_of_Participants__c = 10
        );

          Trip__c TestTripOngoing = new Trip__c (

            Start_Date__c = Date.newInstance(2025, 5, 19),
            End_Date__c = Date.today().addDays(1),
            Number_of_Participants__c = 10
        );

          Trip__c TestTripEnded = new Trip__c (

            Start_Date__c = Date.newInstance(2025, 5, 18),
            End_Date__c = Date.newInstance(2025, 5, 19),
            Number_of_Participants__c = 10
        );

        List <Trip__c> testTrips = new List <Trip__c>();
       
        testTrips.add(TestTripMixDates) ;
        testTrips.add(TestTripCancelled) ;
        testTrips.add(TestTripComing) ; 
        testTrips.add(TestTripOngoing) ; 
        testTrips.add(TestTripEnded) ; 

        return testTrips;
        }

        public static List<Trip__c> createTestDataTrip() {
      
        Account testAccount = new Account(
            Name = 'Test Account for Factory Usage',
            Client_Type_2__c = 'Particulier',
            ShippingStreet = 'Route des montagnes 101',
            ShippingCity = 'Lausanne',
            ShippingPostalCode = '1000',
            ShippingCountry = 'Suisse'
        );
        insert testAccount;

        Opportunity testOpp = new Opportunity(
            Name = 'Test Opportunity for Factory Usage',
            StageName = 'Prospecting',
            CloseDate = System.today().addDays(30),
            Number_of_Participants__c = 14,
            Destination__c = 'Somewhere',
            Start_Date__c = Date.newInstance(2025, 5, 28),
            End_Date__c = Date.newInstance(2025, 5, 27),
            Amount = 12000,
            AccountId = testAccount.Id
        );
        insert testOpp;

        Trip__c Testa = new Trip__c (

            Start_Date__c = Date.today().addDays(7),
            End_Date__c = Date.today().addDays(8),
            Number_of_Participants__c = 5
        );

          Trip__c Testb = new Trip__c (

            Start_Date__c = Date.today().addDays(7),
            End_Date__c = Date.today().addDays(8),
            Number_of_Participants__c = 7
        );

          Trip__c Testc = new Trip__c (

            Start_Date__c = Date.today().addDays(7),
            End_Date__c = Date.today().addDays(8),
            Number_of_Participants__c = 7
        );

          Trip__c Testd = new Trip__c (

            Start_Date__c = Date.today().addDays(7),
            End_Date__c = Date.today().addDays(8),
            Number_of_Participants__c = 7
        );

          Trip__c Teste = new Trip__c (

            Start_Date__c = Date.today().addDays(7),
            End_Date__c = Date.today().addDays(8),
            Number_of_Participants__c = 7
        );

        List <Trip__c> testTrips = new List <Trip__c>();
       
        testTrips.add(Testa) ;
        testTrips.add(Testb) ;
        testTrips.add(Testc) ; 
        testTrips.add(Testd) ; 
        testTrips.add(Teste) ; 

        return testTrips;
        }

        public static List<Trip__c> createTestDataTripB() {
      
        Account testAccount = new Account(
            Name = 'Test Account for Factory Usage',
            Client_Type_2__c = 'Particulier',
            ShippingStreet = 'Route des montagnes 101',
            ShippingCity = 'Lausanne',
            ShippingPostalCode = '1000',
            ShippingCountry = 'Suisse'
        );
        insert testAccount;

        Opportunity testOpp = new Opportunity(
            Name = 'Test Opportunity for Factory Usage',
            StageName = 'Prospecting',
            CloseDate = System.today().addDays(30),
            Number_of_Participants__c = 14,
            Destination__c = 'Somewhere',
            Start_Date__c = Date.newInstance(2025, 5, 28),
            End_Date__c = Date.newInstance(2025, 5, 27),
            Amount = 12000,
            AccountId = testAccount.Id
        );
        insert testOpp;

        Trip__c TestDone = new Trip__c (

            Start_Date__c = Date.today().addDays(-7),
            End_Date__c = Date.today().addDays(-6),
            Number_of_Participants__c = 10
        );

          Trip__c TestCurrent = new Trip__c (

            Start_Date__c = Date.today().addDays(-7),
            End_Date__c = Date.today().addDays(8),
            Number_of_Participants__c = 10
        );

          Trip__c TestComing = new Trip__c (

            Start_Date__c = Date.today().addDays(7),
            End_Date__c = Date.today().addDays(8),
            Number_of_Participants__c = 10
        );


        List <Trip__c> testTrips = new List <Trip__c>();
       
        testTrips.add(TestComing) ;
        testTrips.add(TestCurrent) ;
        testTrips.add(TestDone) ; 

        return testTrips;
        }
}