import { Builder, By, Key, until, Select, WebElement } from 'selenium-webdriver';
import assert from 'assert';

async function runSignUptests(){
    const driver = await new Builder().forBrowser('MicrosoftEdge').build();

    const signupDetails = [
        // Test Case 1: Successful Signup (New User)
        ['John Doe', 'johndoe1352323@gmail.com', 'password123', 'Candidate', true, 'Account created successfully'],
      
        // Test Case 2: Email Already Exists
        ['Varun Sriram', 'varunsriram10@gmail.com', 'abcd@1234', 'Candidate', false, 'User already exists'],
      
        // Test Case 3: Weak Password
        ['Emily Clark', 'emilyclar352k5678@gmail.com', '123', 'Candidate', false, 'Password is too weak'],
      
        // Test Case 4: Invalid Email Format
        ['Michael Smith', 'michael.....smith@.com', 'mypass789', 'Expert', false, 'Invalid email format'],
      
        // Test Case 5: Successful Signup (Recruiter)
        ['Robert Williams', 'robert.williiams123@gmail.com', 'strongPass456', 'Expert', true, 'Account created successfully'],

      ];
      
      try {
        for (let i = 0; i < signupDetails.length; i++) {
          const [name, email, password, role, expectedStatus, expectedMessage] = signupDetails[i];
          console.log(`🧪 Running Test ${i + 1}: ${name}`);
    
          await driver.get('http://localhost:3000/signup');

          await driver.findElement(By.id('name')).sendKeys(name);
          await driver.findElement(By.id('email')).sendKeys(email);
          await driver.findElement(By.id('password')).sendKeys(password);
          let roleSelect = await driver.findElement(By.id('role'));
          const select = new Select(roleSelect);
          
          try {
            await select.selectByVisibleText(role);
          } catch (e) {
            console.error(`❗ Error selecting role for Test ${i + 1}: ${e.message}`);
            continue;
          }
    
          await driver.findElement(By.css('button[type="submit"]')).click();
    
          await driver.sleep(3000);
          const errorMessageElement = await driver.wait(
            until.elementLocated(By.id('error')),
            5000
          ).catch(() => null);
          const actualMessage = errorMessageElement ? await errorMessageElement.getText() : null;

          console.log(actualMessage, `Expected: ${expectedMessage}`);  
          try {
            if (expectedStatus) {
              assert.strictEqual(actualMessage, expectedMessage, `Expected success but got error: ${actualMessage}`);
            } else {
              assert.strictEqual(actualMessage, expectedMessage, `Expected error: "${expectedMessage}", but got: "${actualMessage}"`);
            }
            console.log(`✅ Test ${i + 1} Passed`);
          } catch (assertionError) {
            console.error(`❌ Test ${i + 1} Failed - ${assertionError.message}`);
          }
        }
      } catch (error) {
        console.error('❌ Test Suite Error:', error);
      } finally {
        await driver.quit();
      }
}

// runSignUptests();

async function runInterviewSchedulingTests(){
    const driver = await new Builder().forBrowser('MicrosoftEdge').build();

    const TestDetails = [
      // Test 1 : Correct Details
      ['Varun', 'varunsriram10@gmail.com', 'Data Analyst', '10-04-2025T14:30', 'https://nexusmeetapp.vercel.app/ca8c116b-bc54-49dc-9b36-3464d9cc8cd7', 'https://nexusmeetapp.vercel.app/ca8c116b-bc54-49dc-9b36-3464d9cc8cd7', 'Email sent successfully!', 'Interview scheduled successfully!' ],

      // Test 2 : Incorrect email Id
      ['Varun', 'varunsriram2gmail.com', 'Data Analyst', '10-04-2025T14:30', 'https://nexusmeetapp.vercel.app/ca8c116b-bc54-49dc-9b36-3464d9cc8cd7', 'https://nexusmeetapp.vercel.app/ca8c116b-bc54-49dc-9b36-3464d9cc8cd7', 'Failed to send the email', 'Failed to schedule the interview'],

      // Test 3 : Wrong Date - Past Date
      ['Varun', 'varunsriram10@gmail.com', 'Data Analyst', '10-03-2025T14:30', 'https://nexusmeetapp.vercel.app/ca8c116b-bc54-49dc-9b36-3464d9cc8cd7', 'https://nexusmeetapp.vercel.app/ca8c116b-bc54-49dc-9b36-3464d9cc8cd7', 'Failed to send the email', 'Failed to schedule the interview'],

      // Test 4 : Wrong Time - Past time
      ['Varun', 'varunsriram10@gmail.com', 'Data Analyst', '31-03-2025T14:30', 'https://nexusmeetapp.vercel.app/ca8c116b-bc54-49dc-9b36-3464d9cc8cd7', 'https://nexusmeetapp.vercel.app/ca8c116b-bc54-49dc-9b36-3464d9cc8cd7', 'Failed to send the email', 'Failed to schedule the interview'],

      // Test 5 : Incorrect Meet Link
      ['Varun', 'varunsriram10@gmail.com', 'Data Analyst', '10-04-2025T14:30', 'abcd', 'abcd', 'Failed to send the email', 'Failed to schedule the interview'],

      // Test 6 : Incorrect Meet Link Id
      ['Varun', 'varunsriram10@gmail.com', 'Data Analyst', '10-04-2025T14:30', 'https://nexusmeetapp.vercel.app/ca8c116b-bc54-49dc-9b-3464d9cc8cd7', 'https://nexusmeetapp.vercel.app/ca8c116b-bc54-49-9b36-3464d9cc8cd7', 'Failed to send the email', 'Failed to schedule the interview'],

      // Test 7 : 
    ]


    try{
      await driver.get('http://localhost:3000/signin');
      await driver.findElement(By.id('email')).sendKeys('vssriram_b22@ce.vjti.ac.in');
      await driver.findElement(By.id('password')).sendKeys('abcd@123');
      await driver.findElement(By.css('button[type="submit"]')).click();
      for(let i=0;i<TestDetails.length;i++){
        const [name, email, Job_Position, DateTime, HostLink, CandidateLink, expectedEmailMessage, expectedSchedulingMessage] = TestDetails[i];

      
        await driver.sleep(2000);
        await driver.get('http://localhost:3000/dashboard?id=67ea7b180a29232d0d176f29')

        // Opening the modal 
        await driver.sleep(5000)
        await driver.findElement(By.xpath("//button[contains(text(), 'Schedule New Interview')]")).click();
        await driver.sleep(2000)

        // inputing details
        await driver.findElement(By.name('name')).sendKeys(name);
        await driver.findElement(By.name('email')).sendKeys(email);
        await driver.findElement(By.name('jobPosition')).sendKeys(Job_Position);
        // var datebox = await driver.findElement(By.name('interviewTime')).click();
        // await driver.sleep(1000)
        const Date = DateTime.split('T')[0];
        const Time = DateTime.split('T')[1];
        await driver.findElement(By.xpath("//input[@name='interviewDate']")).sendKeys(Date)
        await driver.findElement(By.xpath("//input[@name='interviewTime']")).sendKeys(Time);
        // await driver.sleep(500);

        await driver.findElement(By.name('HostLink')).sendKeys(HostLink)
        await driver.findElement(By.name('candidateLink')).sendKeys(CandidateLink)

        await driver.findElement(By.xpath("//button[contains(text(), 'Create & Share')]")).click();

        const actualEmailMessage = await driver.wait(
          until.elementLocated(By.id('emailmes')),
          5000
        ).getText().catch(() => null);

        const actualSchedulingMessage = await driver.wait(
          until.elementLocated(By.id('mes')),
          5000
        ).getText().catch(() => null);
        console.log(`Test ${i + 1} - Expected Email Message: ${expectedEmailMessage}, Actual Email Message: ${actualEmailMessage}`);
        console.log(`Test ${i + 1} - Expected Scheduling Message: ${expectedSchedulingMessage}, Actual Scheduling Message: ${actualSchedulingMessage}`);
        

        try{
          assert.strictEqual(actualEmailMessage, expectedEmailMessage, `Expected success but got error: ${actualEmailMessage}`);
          assert.strictEqual(actualSchedulingMessage, expectedSchedulingMessage, `Expected error: "${expectedSchedulingMessage}", but got: "${actualSchedulingMessage}"`);
          console.log(`✅ Test ${i + 1} Passed`);
        }
        catch(assertionError){
          console.error(`❌ Test ${i + 1} Failed - ${assertionError.message}`);
        }
        await driver.sleep(5000)

      }
    }
    catch(error){
      console.error('❌ Test Suite Error:', error)
    }
    finally{
      await driver.quit();
    }

}

runInterviewSchedulingTests();