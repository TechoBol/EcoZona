import {
  Container,
  Title,
  Grid,
  Card,
  IconWrapper,
  Label,
  PageWrapper,
  StyledLink 
} from "../components/ui/Home";
import { FolderPlus, Sheet, Truck } from "lucide-react";

const Home = () => {
  //const { systemAccess } = useLoginStore();

  return (
    <PageWrapper>
      <Container>
        <Title>Centro de sistema de costos</Title>

        <Grid>
          <Grid>
            <StyledLink  to="/new-importation">
              <Card>
                <IconWrapper>
                  <FolderPlus />
                </IconWrapper>
                <Label>Registrar inportacion</Label>
              </Card>
            </StyledLink >
            <StyledLink  to="/list-importations">
              <Card>
                <IconWrapper>
                  <Truck />
                </IconWrapper>
                <Label>Importaciones</Label>
              </Card>
            </StyledLink >
            <StyledLink  to="/table-importations">
              <Card>
                <IconWrapper>
                  <Sheet />
                </IconWrapper>
                <Label>Tabla de costos</Label>
              </Card>
            </StyledLink >
          </Grid>
        </Grid>
      </Container>
    </PageWrapper>
  );
};

export default Home;
