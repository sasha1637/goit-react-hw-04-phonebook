import { ToastContainer, toast } from 'react-toastify';
import { Wrapper, Title, Message } from 'components/App.styled';
import 'react-toastify/dist/ReactToastify.css';
import ContactForm from 'components/ContactForm/ContactForm';
import ContactList from 'components/ContactList/ContactList';
import Filter from 'components/Filter/Filter';
import { useState, useEffect } from 'react';
const getInitialContacts = () => {
  const contacts = localStorage.getItem('Contacts');
  const parsedContacts = JSON.parse(contacts);
  if (parsedContacts) {
    return parsedContacts;
  } else {
    return [];
  }
};
export function App() {
  const [contacts, setContacts] = useState(getInitialContacts);
  const [filter, setFilter] = useState('');
  useEffect(() => {
    localStorage.setItem('Contacts', JSON.stringify(contacts));
  }, [contacts]);
  const FilterContacts = e => {
    const { value } = e.target;
    setFilter(value);
  };
  const getVisibleContacts = () => {
    const normalizeFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizeFilter)
    );
  };
  const ContactDelete = id => {
    const contactDelete = contacts.find(contact => contact.id === id);
    setContacts(contacts.filter(contact => contact.id !== id));
    toast.success(`Contact deleted ${contactDelete.name}`);
  };
  const AddContact = data => {
    const { name, number: NewNumber } = data;
    const normalizeName = name.toLowerCase();
    if (
      contacts.find(
        ({ name, number }) =>
          name.toLowerCase() === normalizeName || number === NewNumber
      )
    ) {
      toast(
        'The subscriber with such contact details is already in the phone book '
      );
    } else {
      setContacts(Contacts => [data, ...Contacts]);
    }
  };

  return (
    <Wrapper>
      <h1>Phonebook</h1>
      <ToastContainer />

      <ContactForm onSubmit={AddContact}></ContactForm>
      <Title>Contacts</Title>
      {contacts.length ? (
        <>
          <Filter value={filter} onChange={FilterContacts} />
          {getVisibleContacts().length ? (
            <ContactList
              contacts={getVisibleContacts()}
              ContactDelete={ContactDelete}
            />
          ) : (
            <Message>No find contact</Message>
          )}
        </>
      ) : (
        <Message>No contact</Message>
      )}
    </Wrapper>
  );
}
