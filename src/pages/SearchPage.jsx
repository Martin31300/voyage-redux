import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import DestinationGrid from "../components/DestinationGrid.jsx";
import Loader from "../components/Loader.jsx";
import { clearSearch, searchDestinations } from "../store/searchSlice.js";

const schema = yup
  .object({
    keywords: yup
      .string()
      .trim()
      .test("min", "La recherche doit avoir au moins 2 caractères", (v) => !v || v.length >= 2),
    region: yup.string(),
  })
  .test("one-of", function (value) {
    if (value.keywords || value.region) return true;
    return this.createError({
      path: "keywords",
      message: "Veuillez saisir un mot-clé ou choisir une région",
    });
  });

export default function SearchPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const keyword = params.get("q") || "";
  const region = params.get("region") || "";
  const regions = useSelector((state) => state.destinations.regions);
  const { results, status, error } = useSelector((state) => state.search);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    values: { keywords: keyword, region },
  });

  useEffect(() => {
    if (keyword || region) {
      dispatch(searchDestinations({ keyword, region }));
    } else {
      dispatch(clearSearch());
    }
  }, [dispatch, keyword, region]);

  const onSubmit = (data) => {
    const next = new URLSearchParams();
    if (data.keywords) next.set("q", data.keywords);
    if (data.region) next.set("region", data.region);
    navigate(`/search?${next.toString()}`);
  };

  const hasSearch = keyword || region;

  return (
    <section>
      <h1 className="mb-4">Rechercher une destination</h1>
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label htmlFor="keywords">Mots-clés</Form.Label>
                <Form.Control
                  id="keywords"
                  placeholder="Pays, capitale, région"
                  isInvalid={!!errors.keywords}
                  {...register("keywords")}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.keywords?.message}
                </Form.Control.Feedback>
              </Col>
              <Col md={6}>
                <Form.Label htmlFor="region">Région</Form.Label>
                <Form.Select id="region" {...register("region")}>
                  <option value="">Toutes les régions</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.slug}>
                      {r.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            <Button variant="outline-primary" type="submit" className="mt-3">
              Rechercher
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {hasSearch && (
        <>
          <h2 className="h4 mb-3">Résultats de la recherche</h2>
          <Loader status={status} error={error}>
            <DestinationGrid
              destinations={results}
              emptyMessage="Aucun résultat ne correspond à votre recherche"
            />
          </Loader>
        </>
      )}
    </section>
  );
}
